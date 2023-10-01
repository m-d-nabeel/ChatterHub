"use client";

import { ExternalLinkIcon, FileIcon } from "lucide-react";
import React from "react";
interface ChatFileItemProps {
  fileUrl: string;
  fileType: string;
}
const ChatFileItem = ({ fileUrl, fileType }: ChatFileItemProps) => {
  return (
    <div className="group/href relative mt-2 flex h-fit w-fit items-center justify-center rounded-md bg-discord-gray1 p-3">
      <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
      <a
        href={fileUrl}
        className="absolute -top-1 right-0 h-5 w-5"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLinkIcon className="pointer-events-none text-indigo-200 opacity-0 transition-all hover:text-foreground group-hover:pointer-events-auto group-hover/href:block group-hover/href:-translate-y-1 group-hover/href:translate-x-1 group-hover/href:opacity-100" />
      </a>
      <span className="pointer-events-none mx-2 select-none text-sm font-semibold text-indigo-500">
        {fileType?.toUpperCase()} File
      </span>
    </div>
  );
};

export default ChatFileItem;
