import type { ActionFunction } from "@remix-run/node";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.text();
  const headers = Object.fromEntries(request.headers);

  // Validate webhook
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const eventType = evt.type;
  const data = evt.data;

  // ----------------------------------------------------
  // USER CREATED
  // ----------------------------------------------------
  if (eventType === "user.created") {
    const email =
      data.email_addresses?.[0]?.email_address ??
      `user-${data.id}@noemail.clyra.ai`;

    // 1. Create Supabase Auth user
    const { data: authUser } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        clerk_id: data.id,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        avatar: data.profile_image_url,
      },
    });

    if (!authUser) {
      return new Response("Auth creation failed", { status: 500 });
    }

    // 2. Insert into your "users" table
    await supabase.from("users").insert({
      supabase_id: authUser.user.id,
      clerk_id: data.id,
      email,
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      avatar_url: data.profile_image_url,
    });

    // 3. Set default 500 daily tokens
    await supabase.from("token_usage").insert({
      clerk_id: data.id,
      tokens_left: 500,
    });
  }

  // ----------------------------------------------------
  // USER UPDATED
  // ----------------------------------------------------
  if (eventType === "user.updated") {
    await supabase
      .from("users")
      .update({
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        avatar_url: data.profile_image_url,
      })
      .eq("clerk_id", data.id);
  }

  // ----------------------------------------------------
  // USER DELETED
  // ----------------------------------------------------
  if (eventType === "user.deleted") {
    await supabase.from("users").delete().eq("clerk_id", data.id);
    await supabase.from("token_usage").delete().eq("clerk_id", data.id);
  }

  return new Response("ok", { status: 200 });
};

export const loader = () => new Response("Not allowed", { status: 405 });
