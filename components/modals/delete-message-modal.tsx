"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import qs from "query-string";

// local imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useToast } from "../ui/use-toast";

const DeleteMessageModal = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [serverName, setServerName] = useState<string>("");
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteMessage";

  const handleClose = () => {
    onClose();
  };

  const handleDeleteMessage = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("[ON_SERVER_DELETE]", error);
      toast({
        description: "Operation failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="select-none border-transparent bg-discord-gray2 p-0">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-start text-2xl font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground">
            Are you sure you want to delete this message?
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full justify-end gap-x-3 bg-discord-gray3 px-6 py-3">
          <Button
            disabled={isLoading}
            variant="link"
            onClick={handleClose}
            className="ring-offset-transparent focus-visible:ring-transparent"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            className="rounded-sm bg-rose-600 text-white transition-all hover:bg-rose-700"
            onClick={handleDeleteMessage}
          >
            Delete Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
