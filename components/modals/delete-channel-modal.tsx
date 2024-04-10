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

const DeleteChannelModal = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();
  const { channel, serverId } = data;
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteChannel";

  const handleClose = () => {
    onClose();
  };

  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId,
        },
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/servers/${serverId}`);
    } catch (error) {
      console.error("[ON_CHANNEL_DELETE]", error);
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
        <DialogHeader className="px-6 py-4">
          <DialogTitle className="text-start text-2xl font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="text-sm font-semibold text-muted-foreground">
            Are you sure you want to delete <span className="brightness-150">{channel?.name}</span>{" "}
            ? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full justify-end gap-x-3 bg-discord-gray3 px-3 py-3">
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
            className="rounded-sm bg-red-500 text-white transition-all hover:bg-red-600"
            onClick={handleDeleteChannel}
          >
            Delete Channel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
