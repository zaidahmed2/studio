"use client"

import * as React from "react"
import Link from "next/link"
import { ZaniaLogo } from "@/components/zania-logo"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
           <ZaniaLogo />
        </Link>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
