"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/atoms/theme-switcher";
import { LogoutButton } from "@/components/atoms/logout-button";

interface NavbarProps {
  userEmail: string;
}

export function Navbar({ userEmail }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        Chat App
      </Link>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="flex items-center gap-4">
          Hey, {userEmail}!
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
