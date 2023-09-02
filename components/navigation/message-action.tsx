"use client";

import { MessageSquareIcon } from "lucide-react";
import { Button } from "../ui/button";
import ActionTooltip from "../action-tooltip";

const MessageAction = () => {
  return (
    <ActionTooltip label="Message" side="right" align="center">
      <div className="group">
        <Button
          className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-discord-gray1 transition-all group-hover:rounded-[12px] group-hover:bg-indigo-500"
          variant="ghost"
          size="icon"
        >
          <MessageSquareIcon className="fill-gray-400 text-gray-400 transition group-hover:fill-gray-200 group-hover:text-gray-200" />
        </Button>
      </div>
    </ActionTooltip>
  );
};

export default MessageAction;
