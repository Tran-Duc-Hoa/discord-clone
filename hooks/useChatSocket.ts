import { Member, Message, Profile } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useSocket } from '@/components/providers/SocketProvider';

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<MessageWithMemberWithProfile[]>([queryKey], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) return old;

        const newData = old.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            })
          };
        });

        return { ...old, pages: newData };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<MessageWithMemberWithProfile[]>([queryKey], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) return { pages: [{ items: [message] }] };

        const newData = [...old.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items]
        };

        return { ...old, pages: newData };
      });
    });

    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, [socket, updateKey, addKey, queryKey, queryClient]);
};
