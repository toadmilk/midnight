import { createContext, ReactNode, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';

type StreamResponse = {
  addMessage: () => void,
  message: string,
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  isLoading: boolean,
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
});

interface ChatContextProviderProps {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: ChatContextProviderProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useContext();

  const { toast } = useToast();

  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch(`/api/message`, {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.body;
    },
    onMutate: async () => {
    //   backupMessage.current = message;
    //   setMessage("");
    //
    //   await utils.getFileMessages.cancel();
    //
    //   const previousMessages = utils.getFileMessages.getInfiniteData();
    //
    //   utils.getFileMessages.setInfiniteData({fileId, limit: INFINITE_QUERY_LIMIT}, (old) => {
    //     if (!old) {
    //       return {
    //         pages: [],
    //         pageParams: [],
    //       }
    //     }
    //   });
    }
  });

  const addMessage = () => sendMessage({ message });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  }

  return (
    <ChatContext.Provider value={{
      addMessage,
      message,
      handleInputChange,
      isLoading,
    }}>
      {children}
    </ChatContext.Provider>
  );
};