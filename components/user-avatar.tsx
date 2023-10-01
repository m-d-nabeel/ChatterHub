"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";

const UserAvatar = ({
  imageUrl,
  className,
}: {
  imageUrl: string;
  className?: string;
}) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>
        <Loader2Icon className="animate-spin" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
