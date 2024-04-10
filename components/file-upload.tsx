"use client";

import { FC } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

import { ExternalLinkIcon, FileIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endPoint: "serverImage" | "messageFile";
  className?: string;
}

const FileUpload: FC<FileUploadProps> = ({ value, onChange, endPoint, className }) => {
  const fileType = value.split(".").pop();
  if (value && fileType !== "pdf" && fileType !== "txt") {
    return (
      <div className="relative h-36 w-36">
        <Button
          type="button"
          variant="ghost"
          className="absolute right-1.5 top-1.5 z-10 h-fit w-fit rounded-full bg-rose-500 p-1 text-white shadow-sm transition-colors hover:bg-rose-600"
          onClick={() => onChange("")}
        >
          <XIcon className="h-4 w-4" />
        </Button>
        <Image src={value} alt="upload" fill className="rounded-full object-cover object-top" />
      </div>
    );
  }
  if (value && fileType !== "image") {
    return (
      <div className="group relative flex items-center justify-center rounded-md bg-discord-gray1 p-3">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          className="group/href absolute -top-1 right-0 h-5 w-5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLinkIcon className="pointer-events-none text-indigo-200 opacity-0 transition-all group-hover:pointer-events-auto group-hover:block group-hover:-translate-x-1 group-hover:-translate-y-4 group-hover/href:text-foreground group-hover:opacity-100" />
        </a>
        <Button
          type="button"
          variant="ghost"
          className="pointer-events-none absolute -right-1 top-0 h-fit w-fit rounded-full bg-rose-500 p-1 text-foreground opacity-0 shadow-sm transition-all hover:bg-rose-600 group-hover:pointer-events-auto group-hover:block group-hover:translate-x-4 group-hover:translate-y-1 group-hover:opacity-100"
          onClick={() => {
            onChange("");
          }}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  return (
    <UploadDropzone
      className={cn(
        "h-60 w-60 rounded-full border-2 border-dashed border-foreground bg-discord-gray3",
        className,
      )}
      endpoint={endPoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
