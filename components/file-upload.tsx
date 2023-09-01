import { FC } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { XIcon } from "lucide-react";
import { Button } from "./ui/button";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endPoint: "serverImage" | "messageFile";
}

const FileUpload: FC<FileUploadProps> = ({ value, onChange, endPoint }) => {
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
        <Image
          src={value}
          alt="upload"
          fill
          className="rounded-full object-cover object-top"
        />
      </div>
    );
  }
  return (
    <UploadDropzone
      className="bg-discord-gray3 h-60 w-60 rounded-full border-2 border-dashed border-foreground"
      endpoint={endPoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
