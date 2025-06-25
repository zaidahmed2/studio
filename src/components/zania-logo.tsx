import * as React from "react"
import { cn } from "@/lib/utils"

export function ZaniaLogo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-accent"
        >
            <title>Zania Icon</title>
            <path d="M4 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 4H20L4 20H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-2xl font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Zania</span>
    </div>
  )
}
