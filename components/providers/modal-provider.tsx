"use client";

import { useEffect, useState } from "react";
import CreateServelModal from "../modals/create-server-modal";
import InviteModal from "../modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/members-modal";
import CreateChannelModal from "../modals/create-channel-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServelModal />;
      <InviteModal />;
      <EditServerModal />;
      <MembersModal />
      <CreateChannelModal />
    </>
  );
};

export default ModalProvider;
