"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC, ReactNode } from "react";

interface ActionTooltipProps {
  children: ReactNode;
  label: string;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "end" | "center";
}

const ActionTooltip: FC<ActionTooltipProps> = ({
  children,
  label,
  side,
  align,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="z-50 bg-discord-gray1"
        >
          <p className="capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
