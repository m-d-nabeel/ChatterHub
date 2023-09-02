"use client";

import { useEffect, useState } from "react";
import CreateServelModal from "../modals/create-server-modal";
import { useModal } from "@/hooks/use-modal-store";
import InviteModal from "../modals/invite-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { type } = useModal();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  switch (type) {
    case "createServer":
      return <CreateServelModal />;
    case "invitation":
      return <InviteModal />;
    default:
      return;
  }
};

export default ModalProvider;
