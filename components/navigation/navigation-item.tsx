"use client";

import { Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FC } from "react";
import ActionTooltip from "../action-tooltip";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
const NavigationItem: FC<NavigationItemProps> = ({ id, name, imageUrl }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <ActionTooltip label={name} side="right" align="center">
      <button
        onClick={() => {
          router.push(`/servers/${id}`);
        }}
        className="group relative flex items-center"
      >
        <Image
          src={imageUrl}
          alt="server"
          height={12}
          width={12}
          className="h-12 w-12 rounded-2xl object-cover"
        />
        <div
          className={cn(
            "absolute -left-4 w-1 translate-x-1 rounded-r-full bg-primary transition-all",
            params?.serverId !== id && "group-hover:h-4",
            params?.serverId === id ? "h-10 group-hover:animate-pulse" : "h-2",
          )}
        />
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
