"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { forwardRef, useState } from "react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DefaultEmojis } from "@/constants";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

const EmojiPicker = forwardRef(({ onChange }: EmojiPickerProps, ref) => {
  const [indexEmoji, setIndexEmoji] = useState(0);

  const updateIndex = () => {
    setIndexEmoji(Math.ceil(Math.random() * DefaultEmojis.length));
  };
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger
        onMouseLeave={updateIndex}
        className="absolute right-10 flex h-fit w-fit items-center justify-center rounded-full grayscale transition-transform duration-200 hover:scale-125 hover:grayscale-0"
      >
        <p className="fixed text-xl">{DefaultEmojis[indexEmoji]}</p>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={76}
        className="mb-[3.5rem] border-none bg-transparent shadow-none drop-shadow-none focus-visible:ring-offset-0"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(value: any) => onChange(value.native)}
        />
      </PopoverContent>
    </Popover>
  );
});

EmojiPicker.displayName = "EmojiPicker";

export default EmojiPicker;
