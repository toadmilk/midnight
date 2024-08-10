import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { ChatContext } from '@/components/chat/ChatContext';
import { useContext, useRef } from 'react';


interface ChatInputProps {
  isDisabled: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {

  const { addMessage, handleInputChange, isLoading, message } = useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                autoFocus
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
                value={message}
                placeholder="Enter your question..."
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch"
              />

              <Button
                disabled={isLoading || isDisabled}
                className="absolute top-1.5 bottom-1.5 right-[8px]"
                aria-label="send message"
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
              >
                <Sparkles className="w-6 h-6 text-white dark:text-black"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;