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
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const DeleteServerModal = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [serverName, setServerName] = useState<string>("");
  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteServer";

  const handleClose = () => {
    onClose();
  };

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/servers/${server?.id}`,
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push("/");
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
            Delete &apos;<span className="brightness-75">{server?.name}</span>
            &apos;
          </DialogTitle>
          <DialogDescription className="rounded-md bg-yellow-500 p-2 text-sm text-foreground shadow">
            Are you sure you want to delete{" "}
            <span className="font-semibold brightness-150">{server?.name}</span>{" "}
            ? This action cannot be undone
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">
            enter server name
          </Label>
          <Input
            className="bg-discord-gray4 ring-offset-transparent focus-visible:ring-transparent"
            type="text"
            onPasteCapture={(event) => {
              event.preventDefault();
            }}
            value={serverName}
            onChange={(event) => setServerName(event.target.value)}
          />
        </div>
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
            disabled={isLoading || serverName !== server?.name}
            className="rounded-sm bg-rose-600 text-white transition-all hover:bg-rose-700"
            onClick={handleLeaveServer}
          >
            Delete Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
