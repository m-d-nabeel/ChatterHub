"use client";

import { useRouter } from "next/navigation";

// local imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

const InviteModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const { server } = data;
  const origin = useOrigin();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "invitation";

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const handleClose = () => {
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleNewLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
      );
      onOpen("invitation", { server: response.data });
    } catch (error) {
      console.error("Failed to generate link", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="border-transparent bg-discord-gray2">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Invite a friend
          </DialogTitle>
        </DialogHeader>
        <div>
          <Label className="font-semibold uppercase text-muted-foreground">
            Server invite link
          </Label>
          <div className="flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              className="border-transparent bg-white/20 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              onClick={handleCopy}
              disabled={isLoading}
              variant="ghost"
              size="icon"
              className="relative bg-discord-gray1 hover:bg-discord-gray1"
            >
              <CopyIcon
                className={cn(
                  "opacity-100 transition-all",
                  isCopied && "opacity-0",
                )}
              />
              <CheckIcon
                className={cn(
                  "absolute opacity-0 transition-all",
                  isCopied && "opacity-100",
                )}
              />
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant="link"
            className="p-0 text-xs text-blue-500"
            onClick={handleNewLink}
          >
            Generate a new link
            <RefreshCwIcon
              className={cn("ml-2 h-4 w-4", isLoading && "animate-spin")}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
