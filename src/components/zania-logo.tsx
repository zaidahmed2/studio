import * as React from "react"
import { cn } from "@/lib/utils"

export function ZaniaLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", className)}
      {...props}
    >
      <title>Zania Logo</title>
      <path d="M7 4h10l-6.5 7.5a2.5 2.5 0 1 0 0 5L17 20H7l6.5-7.5a2.5 2.5 0 1 0 0-5L7 4z" />
    </svg>
  )
}
