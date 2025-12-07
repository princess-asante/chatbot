import Link from "next/link";
import { ThemeSwitcher } from "@/components/atoms/theme-switcher";
import { AuthButton } from "@/components/atoms/auth-button";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        Chat App
      </Link>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <AuthButton />
      </div>
    </nav>
  );
}
