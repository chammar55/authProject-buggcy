"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggleBtn() {
  const { setTheme } = useTheme();
  const [toggleMode, setToggleMode] = React.useState(false);

  const theme = (data: "light" | "dark") => {
    setTheme(data);
    setToggleMode(!toggleMode);
  };

  return (
    <div className="text-black navLinksDarkColors">
      {!toggleMode ? (
        <button onClick={() => theme("light")}>
          <Moon />
        </button>
      ) : (
        <button onClick={() => theme("dark")}>
          <Sun />
        </button>
      )}
    </div>
  );
}
