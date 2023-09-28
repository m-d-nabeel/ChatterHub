"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleItemClick = (type: "channel" | "member", id: string) => {
    setOpen(false);
    if (type === "channel") {
      router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
    if (type === "member") {
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group my-2 flex w-full items-center gap-x-2 rounded-md border border-discord-gray1 px-2 py-2 text-muted-foreground transition hover:text-foreground"
      >
        <SearchIcon className="h-4 w-4" />
        <p className="text-sm font-semibold">Search</p>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-discord-gray1 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList className="bg-discord-gray3">
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map(({ label, data, type }) => (
            <CommandGroup key={label} heading={label}>
              {data?.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleItemClick(type, item.id)}
                  id="dropdown-menu-item"
                  className={cn(
                    "flex w-full justify-start",
                    type === "member" && "flex-row-reverse justify-end gap-x-2",
                  )}
                >
                  {item.icon}
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
