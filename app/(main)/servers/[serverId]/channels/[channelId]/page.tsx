'use client';

import { useParams } from 'next/navigation';

const ChannelIdPage = () => {
  const { channelId } = useParams();

  return <div>ChannelIdPage {channelId}</div>;
};

export default ChannelIdPage;
