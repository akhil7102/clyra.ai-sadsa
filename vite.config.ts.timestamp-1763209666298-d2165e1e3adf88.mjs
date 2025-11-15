// vite.config.ts
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVitePlugin } from "file:///home/project/node_modules/.pnpm/@remix-run+dev@2.17.2_@remix-run+react@2.17.2_@remix-run+serve@2.17.2_sass-embedded@1.93.3_ty_wzu76ugzbabo2uftgadxv7iz4q/node_modules/@remix-run/dev/dist/index.js";
import UnoCSS from "file:///home/project/node_modules/.pnpm/unocss@0.61.9_postcss@8.5.6_vite@5.4.21/node_modules/unocss/dist/vite.mjs";
import { defineConfig } from "file:///home/project/node_modules/.pnpm/vite@5.4.21_sass-embedded@1.93.3/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///home/project/node_modules/.pnpm/vite-plugin-node-polyfills@0.22.0_vite@5.4.21/node_modules/vite-plugin-node-polyfills/dist/index.js";
import { optimizeCssModules } from "file:///home/project/node_modules/.pnpm/vite-plugin-optimize-css-modules@1.2.0_vite@5.4.21/node_modules/vite-plugin-optimize-css-modules/dist/index.mjs";
import tsconfigPaths from "file:///home/project/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.9.3_vite@5.4.21/node_modules/vite-tsconfig-paths/dist/index.mjs";
import * as dotenv from "file:///home/project/node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js";
import autoprefixer from "file:///home/project/node_modules/.pnpm/autoprefixer@10.4.22_postcss@8.5.6/node_modules/autoprefixer/lib/autoprefixer.js";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
dotenv.config();
var vite_config_default = defineConfig((config2) => {
  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    },
    build: {
      target: "esnext"
    },
    plugins: [
      nodePolyfills({
        include: ["buffer", "process", "util", "stream"],
        globals: {
          Buffer: true,
          process: true,
          global: true
        },
        protocolImports: true,
        exclude: ["child_process", "fs", "path"]
      }),
      {
        name: "buffer-polyfill",
        transform(code, id) {
          if (id.includes("env.mjs")) {
            return {
              code: `import { Buffer } from 'buffer';
${code}`,
              map: null
            };
          }
          return null;
        }
      },
      config2.mode !== "test" && remixCloudflareDevProxy(),
      remixVitePlugin({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true
        }
      }),
      UnoCSS(),
      tsconfigPaths(),
      chrome129IssuePlugin(),
      config2.mode === "production" && optimizeCssModules({ apply: "build" })
    ],
    envPrefix: [
      "VITE_",
      "OPENAI_LIKE_API_BASE_URL",
      "OPENAI_LIKE_API_MODELS",
      "OLLAMA_API_BASE_URL",
      "LMSTUDIO_API_BASE_URL",
      "TOGETHER_API_BASE_URL"
    ],
    server: {
      hmr: {
        overlay: false
      }
    },
    css: {
      postcss: {
        plugins: [autoprefixer()]
      },
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    },
    test: {
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/tests/preview/**"
        // Exclude preview tests that require Playwright
      ]
    }
  };
});
function chrome129IssuePlugin() {
  return {
    name: "chrome129IssuePlugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.headers["user-agent"]?.match(/Chrom(e|ium)\/([0-9]+)\./);
        if (raw) {
          const version = parseInt(raw[2], 10);
          if (version === 129) {
            res.setHeader("content-type", "text/html");
            res.end(
              '<body><h1>Please use Chrome Canary for testing.</h1><p>Chrome 129 has an issue with JavaScript modules & Vite local development, see <a href="https://github.com/stackblitz/bolt.new/issues/86#issuecomment-2395519258">for more information.</a></p><p><b>Note:</b> This only impacts <u>local development</u>. `pnpm run build` and `pnpm run start` will work fine in this browser.</p></body>'
            );
            return;
          }
        }
        next();
      });
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBjbG91ZGZsYXJlRGV2UHJveHlWaXRlUGx1Z2luIGFzIHJlbWl4Q2xvdWRmbGFyZURldlByb3h5LCB2aXRlUGx1Z2luIGFzIHJlbWl4Vml0ZVBsdWdpbiB9IGZyb20gJ0ByZW1peC1ydW4vZGV2JztcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCB0eXBlIFZpdGVEZXZTZXJ2ZXIgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XG5pbXBvcnQgeyBvcHRpbWl6ZUNzc01vZHVsZXMgfSBmcm9tICd2aXRlLXBsdWdpbi1vcHRpbWl6ZS1jc3MtbW9kdWxlcyc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tICdkb3RlbnYnO1xuXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XG5cbi8vIExvYWQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGZyb20gbXVsdGlwbGUgZmlsZXNcbmRvdGVudi5jb25maWcoeyBwYXRoOiAnLmVudi5sb2NhbCcgfSk7XG5kb3RlbnYuY29uZmlnKHsgcGF0aDogJy5lbnYnIH0pO1xuZG90ZW52LmNvbmZpZygpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKGNvbmZpZykgPT4ge1xuICByZXR1cm4ge1xuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuTk9ERV9FTlYpLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBub2RlUG9seWZpbGxzKHtcbiAgICAgICAgaW5jbHVkZTogWydidWZmZXInLCAncHJvY2VzcycsICd1dGlsJywgJ3N0cmVhbSddLFxuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgQnVmZmVyOiB0cnVlLFxuICAgICAgICAgIHByb2Nlc3M6IHRydWUsXG4gICAgICAgICAgZ2xvYmFsOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBwcm90b2NvbEltcG9ydHM6IHRydWUsXG4gICAgICAgIGV4Y2x1ZGU6IFsnY2hpbGRfcHJvY2VzcycsICdmcycsICdwYXRoJ10sXG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2J1ZmZlci1wb2x5ZmlsbCcsXG4gICAgICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZW52Lm1qcycpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBjb2RlOiBgaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcXG4ke2NvZGV9YCxcbiAgICAgICAgICAgICAgbWFwOiBudWxsLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBjb25maWcubW9kZSAhPT0gJ3Rlc3QnICYmIHJlbWl4Q2xvdWRmbGFyZURldlByb3h5KCksXG4gICAgICByZW1peFZpdGVQbHVnaW4oe1xuICAgICAgICBmdXR1cmU6IHtcbiAgICAgICAgICB2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcbiAgICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcbiAgICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxuICAgICAgICAgIHYzX2xhenlSb3V0ZURpc2NvdmVyeTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgVW5vQ1NTKCksXG4gICAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgICBjaHJvbWUxMjlJc3N1ZVBsdWdpbigpLFxuICAgICAgY29uZmlnLm1vZGUgPT09ICdwcm9kdWN0aW9uJyAmJiBvcHRpbWl6ZUNzc01vZHVsZXMoeyBhcHBseTogJ2J1aWxkJyB9KSxcbiAgICBdLFxuICAgIGVudlByZWZpeDogW1xuICAgICAgJ1ZJVEVfJyxcbiAgICAgICdPUEVOQUlfTElLRV9BUElfQkFTRV9VUkwnLFxuICAgICAgJ09QRU5BSV9MSUtFX0FQSV9NT0RFTFMnLFxuICAgICAgJ09MTEFNQV9BUElfQkFTRV9VUkwnLFxuICAgICAgJ0xNU1RVRElPX0FQSV9CQVNFX1VSTCcsXG4gICAgICAnVE9HRVRIRVJfQVBJX0JBU0VfVVJMJyxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgaG1yOiB7XG4gICAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbYXV0b3ByZWZpeGVyKCldLFxuICAgICAgfSxcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgdGVzdDoge1xuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnKiovbm9kZV9tb2R1bGVzLyoqJyxcbiAgICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgICAnKiovY3lwcmVzcy8qKicsXG4gICAgICAgICcqKi8ue2lkZWEsZ2l0LGNhY2hlLG91dHB1dCx0ZW1wfS8qKicsXG4gICAgICAgICcqKi97a2FybWEscm9sbHVwLHdlYnBhY2ssdml0ZSx2aXRlc3QsamVzdCxhdmEsYmFiZWwsbnljLGN5cHJlc3MsdHN1cCxidWlsZH0uY29uZmlnLionLFxuICAgICAgICAnKiovdGVzdHMvcHJldmlldy8qKicsIC8vIEV4Y2x1ZGUgcHJldmlldyB0ZXN0cyB0aGF0IHJlcXVpcmUgUGxheXdyaWdodFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGNocm9tZTEyOUlzc3VlUGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjaHJvbWUxMjlJc3N1ZVBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgY29uc3QgcmF3ID0gcmVxLmhlYWRlcnNbJ3VzZXItYWdlbnQnXT8ubWF0Y2goL0Nocm9tKGV8aXVtKVxcLyhbMC05XSspXFwuLyk7XG5cbiAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUludChyYXdbMl0sIDEwKTtcblxuICAgICAgICAgIGlmICh2ZXJzaW9uID09PSAxMjkpIHtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgICAgIHJlcy5lbmQoXG4gICAgICAgICAgICAgICc8Ym9keT48aDE+UGxlYXNlIHVzZSBDaHJvbWUgQ2FuYXJ5IGZvciB0ZXN0aW5nLjwvaDE+PHA+Q2hyb21lIDEyOSBoYXMgYW4gaXNzdWUgd2l0aCBKYXZhU2NyaXB0IG1vZHVsZXMgJiBWaXRlIGxvY2FsIGRldmVsb3BtZW50LCBzZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdGFja2JsaXR6L2JvbHQubmV3L2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMjM5NTUxOTI1OFwiPmZvciBtb3JlIGluZm9ybWF0aW9uLjwvYT48L3A+PHA+PGI+Tm90ZTo8L2I+IFRoaXMgb25seSBpbXBhY3RzIDx1PmxvY2FsIGRldmVsb3BtZW50PC91Pi4gYHBucG0gcnVuIGJ1aWxkYCBhbmQgYHBucG0gcnVuIHN0YXJ0YCB3aWxsIHdvcmsgZmluZSBpbiB0aGlzIGJyb3dzZXIuPC9wPjwvYm9keT4nLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLGdDQUFnQyx5QkFBeUIsY0FBYyx1QkFBdUI7QUFDaFUsT0FBTyxZQUFZO0FBQ25CLFNBQVMsb0JBQXdDO0FBQ2pELFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsMEJBQTBCO0FBQ25DLE9BQU8sbUJBQW1CO0FBQzFCLFlBQVksWUFBWTtBQUV4QixPQUFPLGtCQUFrQjtBQUdsQixjQUFPLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDN0IsY0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3ZCLGNBQU87QUFFZCxJQUFPLHNCQUFRLGFBQWEsQ0FBQ0EsWUFBVztBQUN0QyxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTix3QkFBd0IsS0FBSyxVQUFVLFFBQVEsSUFBSSxRQUFRO0FBQUEsSUFDN0Q7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxjQUFjO0FBQUEsUUFDWixTQUFTLENBQUMsVUFBVSxXQUFXLFFBQVEsUUFBUTtBQUFBLFFBQy9DLFNBQVM7QUFBQSxVQUNQLFFBQVE7QUFBQSxVQUNSLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQSxpQkFBaUI7QUFBQSxRQUNqQixTQUFTLENBQUMsaUJBQWlCLE1BQU0sTUFBTTtBQUFBLE1BQ3pDLENBQUM7QUFBQSxNQUNEO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixVQUFVLE1BQU0sSUFBSTtBQUNsQixjQUFJLEdBQUcsU0FBUyxTQUFTLEdBQUc7QUFDMUIsbUJBQU87QUFBQSxjQUNMLE1BQU07QUFBQSxFQUFxQyxJQUFJO0FBQUEsY0FDL0MsS0FBSztBQUFBLFlBQ1A7QUFBQSxVQUNGO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLE1BQ0FBLFFBQU8sU0FBUyxVQUFVLHdCQUF3QjtBQUFBLE1BQ2xELGdCQUFnQjtBQUFBLFFBQ2QsUUFBUTtBQUFBLFVBQ04sbUJBQW1CO0FBQUEsVUFDbkIsc0JBQXNCO0FBQUEsVUFDdEIscUJBQXFCO0FBQUEsVUFDckIsdUJBQXVCO0FBQUEsUUFDekI7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELE9BQU87QUFBQSxNQUNQLGNBQWM7QUFBQSxNQUNkLHFCQUFxQjtBQUFBLE1BQ3JCQSxRQUFPLFNBQVMsZ0JBQWdCLG1CQUFtQixFQUFFLE9BQU8sUUFBUSxDQUFDO0FBQUEsSUFDdkU7QUFBQSxJQUNBLFdBQVc7QUFBQSxNQUNUO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFBQSxNQUMxQjtBQUFBLE1BQ0EscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0osU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUVELFNBQVMsdUJBQXVCO0FBQzlCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUF1QjtBQUNyQyxhQUFPLFlBQVksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQ3pDLGNBQU0sTUFBTSxJQUFJLFFBQVEsWUFBWSxHQUFHLE1BQU0sMEJBQTBCO0FBRXZFLFlBQUksS0FBSztBQUNQLGdCQUFNLFVBQVUsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBRW5DLGNBQUksWUFBWSxLQUFLO0FBQ25CLGdCQUFJLFVBQVUsZ0JBQWdCLFdBQVc7QUFDekMsZ0JBQUk7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUVBO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFFQSxhQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFsiY29uZmlnIl0KfQo=
