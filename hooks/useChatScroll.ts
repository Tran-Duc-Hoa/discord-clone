import { RefObject, useEffect, useState } from 'react';

type Props = {
  chatRef: RefObject<HTMLDivElement>;
  bottomRef: RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({ chatRef, bottomRef, shouldLoadMore, loadMore, count }: Props) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef.current;

    const handleScroll = () => {
      if (!topDiv) return;

      const { scrollTop } = topDiv;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener('scroll', handleScroll);

    return () => {
      topDiv?.removeEventListener('scroll', handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef.current;
    const topDiv = chatRef.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomDiv?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [chatRef, bottomRef, count, hasInitialized]);
};
