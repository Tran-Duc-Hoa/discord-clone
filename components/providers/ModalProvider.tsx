'use client';

import { useEffect, useState } from 'react';

import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateServerModal from '@/components/modals/CreateServerModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import DeleteMessageModal from '@/components/modals/DeleteMessageModal';
import DeleteServerModal from '@/components/modals/DeleteServerModal';
import EditChannelModal from '@/components/modals/EditChannelModal';
import EditServerModal from '@/components/modals/EditServerModal';
import InviteModal from '@/components/modals/InviteModal';
import LeaveServerModal from '@/components/modals/LeaveServerModal';
import MembersModal from '@/components/modals/MembersModal';
import MessageFileModal from '@/components/modals/MessageFilteModal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <DeleteServerModal />
      <EditServerModal />
      <LeaveServerModal />
      <InviteModal />
      <MembersModal />
      <CreateChannelModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};
