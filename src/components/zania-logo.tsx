import * as React from "react"
import { cn } from "@/lib/utils"

export function ZaniaLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 90 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-auto", className)}
      {...props}
    >
      <title>Zania Logo</title>
      <text
        x="0"
        y="32"
        fontFamily="Poppins, sans-serif"
        fontSize="36"
        fontWeight="600"
        fill="currentColor"
      >
        Zania
      </text>
    </svg>
  )
}
