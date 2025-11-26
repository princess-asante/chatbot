"use client";

import { Button } from "@/app/components/atoms/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push("/auth/login")}>Login</Button>
      <Button onClick={() => router.push("/auth/sign-up")}>Sign Up</Button>
    </div>
  );
}
