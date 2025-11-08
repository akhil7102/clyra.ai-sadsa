import React from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { ModelSelector } from '~/components/chat/ModelSelector';
 
import FilePreview from './FilePreview';
import { ScreenshotStateManager } from './ScreenshotStateManager';
import { SendButton } from './SendButton.client';
import { IconButton } from '~/components/ui/IconButton';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import { SupabaseConnection } from './SupabaseConnection';
import { ExpoQrModal } from '~/components/workbench/ExpoQrModal';
import styles from './BaseChat.module.scss';
import { useSupabaseConnection } from '~/lib/hooks/useSupabaseConnection';
import type { ProviderInfo } from '~/types/model';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  uploadedFiles: File[];
  imageDataList: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  chatStarted: boolean;
  exportChat?: () => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  handleFileUpload: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  setUploadedFiles?: ((files: File[]) => void) | undefined;
  setImageDataList?: ((dataList: string[]) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  enhancingPrompt?: boolean | undefined;
  enhancePrompt?: (() => void) | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
  alignLeft?: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const { isConnected } = useSupabaseConnection();
  return (
    <div
      className={classNames(
        'relative transition-theme z-prompt',
        props.alignLeft ? 'w-full max-w-none mx-0 mr-auto self-start' : 'w-full max-w-chat mx-auto',
        'rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-inner p-3',
        'pb-[calc(env(safe-area-inset-bottom)+0.75rem)]'
      )}
    >
      <svg className={classNames(styles.PromptEffectContainer)}>
        <defs>
          <linearGradient
            id="line-gradient"
            x1="20%"
            y1="0%"
            x2="-14%"
            y2="10%"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(-45)"
          >
            <stop offset="0%" stopColor="#4DA8FF" stopOpacity="0%"></stop>
            <stop offset="40%" stopColor="#4DA8FF" stopOpacity="80%"></stop>
            <stop offset="50%" stopColor="#4DA8FF" stopOpacity="80%"></stop>
            <stop offset="100%" stopColor="#4DA8FF" stopOpacity="0%"></stop>
          </linearGradient>
          <linearGradient id="shine-gradient">
            <stop offset="0%" stopColor="white" stopOpacity="0%"></stop>
            <stop offset="40%" stopColor="#ffffff" stopOpacity="80%"></stop>
            <stop offset="50%" stopColor="#ffffff" stopOpacity="80%"></stop>
            <stop offset="100%" stopColor="white" stopOpacity="0%"></stop>
          </linearGradient>
        </defs>
        <rect className={classNames(styles.PromptEffectLine)} pathLength="100" strokeLinecap="round"></rect>
        <rect className={classNames(styles.PromptShine)} x="48" y="24" width="70" height="1"></rect>
      </svg>
      <div className="hidden" />
      <FilePreview
        files={props.uploadedFiles}
        imageDataList={props.imageDataList}
        onRemove={(index) => {
          props.setUploadedFiles?.(props.uploadedFiles.filter((_, i) => i !== index));
          props.setImageDataList?.(props.imageDataList.filter((_, i) => i !== index));
        }}
      />
      <ClientOnly>
        {() => (
          <ScreenshotStateManager
            setUploadedFiles={props.setUploadedFiles}
            setImageDataList={props.setImageDataList}
            uploadedFiles={props.uploadedFiles}
            imageDataList={props.imageDataList}
          />
        )}
      </ClientOnly>
      {props.selectedElement && (
        <div className="flex mx-1.5 gap-2 items-center justify-between rounded-lg rounded-b-none border border-b-none border-bolt-elements-borderColor text-bolt-elements-textPrimary flex py-1 px-2.5 font-medium text-xs">
          <div className="flex gap-2 items-center lowercase">
            <code className="bg-accent-500 rounded-4px px-1.5 py-1 mr-0.5 text-white">
              {props?.selectedElement?.tagName}
            </code>
            selected for inspection
          </div>
          <button
            className="bg-transparent text-accent-500 pointer-auto"
            onClick={() => props.setSelectedElement?.(null)}
          >
            Clear
          </button>
        </div>
      )}
      <div
        className={classNames('relative transition-theme rounded-2xl border border-transparent')}
      >
        <textarea
          ref={props.textareaRef}
          className={classNames(
            'w-full pl-4 pt-4 pr-4 outline-none resize-none bg-transparent text-sm',
            'text-white/90 placeholder-[#9b9b9b]',
            'transition-all duration-200',
          )}
          onFocus={(e) => {
            try {
              const scroller = document.querySelector('.modern-scrollbar') as HTMLElement | null;
              if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
              e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' });
            } catch {}
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '2px solid #1488fc';
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '2px solid #1488fc';
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';

            const files = Array.from(e.dataTransfer.files);
            files.forEach((file) => {
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = (e) => {
                  const base64Image = e.target?.result as string;
                  props.setUploadedFiles?.([...props.uploadedFiles, file]);
                  props.setImageDataList?.([...props.imageDataList, base64Image]);
                };
                reader.readAsDataURL(file);
              }
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return;
              }

              event.preventDefault();

              if (props.isStreaming) {
                props.handleStop?.();
                return;
              }

              // ignore if using input method engine
              if (event.nativeEvent.isComposing) {
                return;
              }

              props.handleSendMessage?.(event);
            }
          }}
          value={props.input}
          onChange={(event) => {
            props.handleInputChange?.(event);
          }}
          onPaste={props.handlePaste}
          style={{
            minHeight: props.TEXTAREA_MIN_HEIGHT,
            maxHeight: props.TEXTAREA_MAX_HEIGHT,
          }}
          placeholder={'How can Clyra.ai help you today?'}
          translate="no"
        />
        <div className="flex items-center justify-between gap-3 text-sm p-2 pt-3">
          <div className="flex gap-2 items-center">
            <IconButton title="Upload file" className="transition-all text-[#9b9b9b] hover:text-[#00FFB7] hover:shadow-[0_0_8px_#00FFB7]" onClick={() => props.handleFileUpload()}>
              <div className="i-ph:paperclip text-xl"></div>
            </IconButton>

            <SpeechRecognitionButton
              isListening={props.isListening}
              onStart={props.startListening}
              onStop={props.stopListening}
              disabled={props.isStreaming}
            />

            <ClientOnly>
              {() => (
                <div className="flex items-center gap-2 pl-2 min-w-[240px] max-w-full">
                  <ModelSelector
                    key={props.provider?.name + ':' + props.modelList.length}
                    model={props.model}
                    setModel={props.setModel}
                    modelList={props.modelList}
                    provider={props.provider}
                    setProvider={props.setProvider}
                    providerList={props.providerList || (PROVIDER_LIST as ProviderInfo[])}
                    apiKeys={props.apiKeys}
                    modelLoading={props.isModelLoading}
                  />
                  <button
                    type="button"
                    title={isConnected ? 'Supabase connected' : 'Supabase disconnected'}
                    onClick={() => document.dispatchEvent(new Event('open-supabase-connection'))}
                    className={classNames(
                      'p-1.5 rounded-md transition-all',
                      isConnected
                        ? 'text-[#00FFB7] drop-shadow-[0_0_8px_#00FFB7]'
                        : 'text-[#6b7280] hover:text-[#00FFB7] hover:drop-shadow-[0_0_8px_#00FFB7]'
                    )}
                  >
                    <div className="i-ph:lightning text-xl" />
                  </button>
                </div>
              )}
            </ClientOnly>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden">
              <SupabaseConnection />
            </div>
            <ExpoQrModal open={props.qrModalOpen} onClose={() => props.setQrModalOpen(false)} />
            <ClientOnly>
              {() => (
                <SendButton
                  position="inline"
                  show={props.input.length > 0 || props.isStreaming || props.uploadedFiles.length > 0}
                  isStreaming={props.isStreaming}
                  disabled={!props.providerList || props.providerList.length === 0}
                  onClick={(event) => {
                    if (props.isStreaming) {
                      props.handleStop?.();
                      return;
                    }

                    if (props.input.length > 0 || props.uploadedFiles.length > 0) {
                      props.handleSendMessage?.(event);
                    }
                  }}
                />
              )}
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
};
