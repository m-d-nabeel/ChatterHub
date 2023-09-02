"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <ActionTooltip label="Server" side="right" align="center">
      <div className="group">
        <Button
          className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-discord-gray1 transition-all group-hover:rounded-[12px] group-hover:bg-emerald-600"
          variant="ghost"
          size="icon"
          onClick={() => onOpen("createServer")}
        >
          <PlusIcon className="text-emerald-500 transition group-hover:text-white" />
        </Button>
      </div>
    </ActionTooltip>
  );
};

export default NavigationAction;
