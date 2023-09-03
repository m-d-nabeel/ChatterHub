"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Avatar>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>pfp</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
