'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { SmileIcon } from 'lucide-react';

import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Props {
  onChange: (emoji: string) => void;
}

const EmojiPicker = ({ onChange }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
        <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)} />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
