import { createContext, ReactNode, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

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

export const ChatContextProvider = ({ fileId, children }) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

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