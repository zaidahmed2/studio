"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit, History, MessageSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ZaniaLogo } from "@/components/zania-logo"

const navItems = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/training", label: "Training Data", icon: BrainCircuit },
  { href: "/logs", label: "Logs", icon: History },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <ZaniaLogo className="w-8 h-8 text-accent" />
            <span className="text-xl font-semibold text-accent group-data-[collapsible=icon]:hidden">
              Zania
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6 md:hidden">
          <SidebarTrigger/>
          <Link href="/" className="flex items-center gap-2 font-semibold">
             <ZaniaLogo className="w-7 h-7 text-accent" />
             <span className="text-lg">Zania</span>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
