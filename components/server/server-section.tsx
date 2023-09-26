"use client";

import React from "react";
import { AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { ChannelType } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";

interface ChannelOptionsProps {
  channelType: ChannelType;
  channelLength: number;
}

const ChannelOptions = ({
  channelType,
  channelLength,
}: ChannelOptionsProps) => {
  const { onOpen } = useModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onOpen("createChannel", { channelType });
  };
  return (
    <AccordionTrigger className="h-12 text-center text-xs font-semibold uppercase text-muted-foreground hover:no-underline">
      {channelType} channels ({channelLength})
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto bg-transparent hover:bg-transparent"
        onClick={(e) => handleClick(e)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </AccordionTrigger>
  );
};

export default ChannelOptions;
