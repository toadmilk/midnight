import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';


interface ChatInputProps {
  isDisabled: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                autoFocus
                placeholder="Enter your suggestion..."
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch"
              />

              <Button className="absolute top-1.5 bottom-1.5 right-[8px]" aria-label="send message">
                <Sparkles className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;