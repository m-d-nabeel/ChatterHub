"use client";

import { useRouter } from "next/navigation";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// local imports
import { Button } from "../ui/button";
import FileUpload from "../file-upload";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import axios from "axios";

const MessageFileModal = () => {
  const router = useRouter();
  const { isOpen, onClose, data, type } = useModal();
  const isModalOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;

  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleClose = () => {
    setFileUrl("");
    onClose();
  };
  // TODO : File should not be getting sent directly we should have an option to send message with it
  const handleFileSend = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, { fileUrl, content: fileUrl });
      handleClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "File upload failed.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="flex w-full flex-col items-center justify-center gap-y-8 border-transparent bg-discord-gray2">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center brightness-75">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <FileUpload
          className="h-56 w-56 -mt-6"
          value={fileUrl}
          onChange={(url) => {
            setFileUrl(url!);
          }}
          endPoint="messageFile"
        />
        <Button
          variant="default"
          disabled={isLoading}
          onClick={handleFileSend}
          className="w-full bg-indigo-600 text-white transition-colors hover:bg-indigo-500"
        >
          Send File
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
