"use client";

// local imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import MemberCard from "../member-card";

const MembersModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState<string>("");
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const isModalOpen = isOpen && type === "members";
  if (!server) {
    return null;
  }
  const members = server.members;
  let descText: string;
  if (members.length > 1) {
    descText = members.length.toString() + " " + "Members";
  } else {
    descText = members.length.toString() + " " + "Member";
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="border-transparent bg-discord-gray2">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center brightness-75">
            {descText}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          {members.map((member) => (
            <div key={member.id} className="mt-8">
              <MemberCard
                member={member}
                server={server}
                loadingId={loadingId}
                setLoadingId={setLoadingId}
                onOpen={onOpen}
              />
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
