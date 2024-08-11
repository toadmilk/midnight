import { cn } from '@/lib/utils';
import { ExtendedMessage } from '@/types/message';
import { Icons } from '@/components/Icons';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface MessageProps {
  message: ExtendedMessage,
  isNextMessageSamePerson: boolean;
}

const Message = ({message, isNextMessageSamePerson}: MessageProps) => {
  return (
    <div className={cn("flex items-end", {
      "justify-end": message.isUserMessage
    })}>
      <div className={cn("relative flex h-6 w-6 aspect-square items-center justify-center", {
        "order-2 bg-indigo-600 rounded-sm": message.isUserMessage,
        "order-1 bg-background rounded-full": !message.isUserMessage,
        invisible: isNextMessageSamePerson
      })}>
        {message.isUserMessage ? (
          <Icons.user className="h-3/4 w-3/4 fill-neutral-200 text-neutral-200"/>
        ) : (
          <Icons.logo/>
        )}
      </div>

      <div className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
        "order-1 items-end": message.isUserMessage,
        "order-2 items-start": !message.isUserMessage
      })}>
        <div className={cn("px-4 py-2 rounded-lg inline-block", {
          "bg-indigo-600 text-white": message.isUserMessage,
          "bg-neutral-200 text-black dark:text-white": !message.isUserMessage,
          "rounded-br-none": !isNextMessageSamePerson && !message.isUserMessage,
        })}>
          {typeof message.text === "string" ? (
            <ReactMarkdown className={cn("prose", {
              "text-neutral-50": message.isUserMessage,
              "text-neutral-950": !message.isUserMessage
            })}>
              {message.text}
            </ReactMarkdown>
          ) : message.text }
          {message.id !== "loading-message" ? (
            <div className={cn("text-xs select-none mt-2 w-full text-right", {
              "text-neutral-500": !message.isUserMessage,
              "text-indigo-300": message.isUserMessage
            })}>
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          ) : null }
        </div>
      </div>
    </div>
  )
}

export default Message;