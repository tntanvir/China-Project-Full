"use client";

import * as React from "react";
import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useDictionary } from "@/components/providers/language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const dictionary = useDictionary();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeCopy = dictionary.navbar?.theme || {
    toggle: "Toggle Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={themeCopy.toggle}
          className="relative flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:border-emerald-500 hover:text-emerald-700 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
        >
          <Sun className="size-4 scale-100 rotate-0 transition-transform duration-200 dark:scale-0 dark:-rotate-90 text-amber-500" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-200 dark:scale-100 dark:rotate-0 text-emerald-400" />
          <span className="sr-only">{themeCopy.toggle}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36 rounded-xl border border-gray-200/90 bg-white p-1 text-gray-900 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
        >
          <div className="flex items-center gap-2">
            <Sun className="size-3.5 text-amber-500" />
            <span>{themeCopy.light}</span>
          </div>
          {mounted && theme === "light" && <Check className="size-3 text-emerald-600 dark:text-emerald-400" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
        >
          <div className="flex items-center gap-2">
            <Moon className="size-3.5 text-emerald-400" />
            <span>{themeCopy.dark}</span>
          </div>
          {mounted && theme === "dark" && <Check className="size-3 text-emerald-600 dark:text-emerald-400" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500">AUTO</span>
            <span>{themeCopy.system}</span>
          </div>
          {mounted && theme === "system" && <Check className="size-3 text-emerald-600 dark:text-emerald-400" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

