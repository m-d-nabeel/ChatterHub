"use client";

import { useEffect, useState } from "react";
import CreateServelModal from "../modals/create-server-modal";

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
      <CreateServelModal />
    </>
  );
};

export default ModalProvider;
