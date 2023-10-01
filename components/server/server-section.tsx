"use client";

import React, { Ref, RefObject, useEffect, useRef } from "react";
import { AccordionTrigger } from "../ui/accordion";
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

  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onOpen("createChannel", { channelType });
  };
  useEffect(() => {
    if (channelType === "TEXT") {
      triggerRef.current?.click();
    }
  }, [channelType]);
  return (
    <AccordionTrigger
      ref={triggerRef}
      className="h-12 text-center text-xs font-semibold uppercase text-muted-foreground hover:no-underline"
    >
      {channelType} channels ({channelLength})
      <div
        className="ml-auto flex items-center bg-transparent px-1 transition-all hover:bg-transparent hover:text-foreground"
        onClick={(e) => handleClick(e)}
      >
        <PlusIcon className="h-4 w-4" />
      </div>
    </AccordionTrigger>
  );
};

export default ChannelOptions;
