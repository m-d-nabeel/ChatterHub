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

const LeaveServerModal = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "leaveServer";

  const handleClose = () => {
    onClose();
  };

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/servers/${server?.id}/leave`,
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("[ON_SERVER_LEAVE]", error);
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
          <DialogTitle className="text-start text-2xl font-bold">
            Leave &apos;
            <span className="pt-2 brightness-75">{server?.name}</span>&apos;
          </DialogTitle>
          <DialogDescription className="text-sm font-semibold text-muted-foreground">
            Are you sure you want to leave{" "}
            <span className="brightness-150">{server?.name}</span> ? You
            won&apos;t be able to re-join the server unless you are re-invited.
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
            className="rounded-sm bg-rose-600 text-white transition-all hover:bg-rose-700"
            onClick={handleLeaveServer}
          >
            Leave Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
