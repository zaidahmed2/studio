import * as React from "react"
import { cn } from "@/lib/utils"

export function ZaniaLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 160 60"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-auto", className)}
      {...props}
    >
      <title>Zania Logo</title>
      <text
        x="5"
        y="45"
        fontFamily="'Dancing Script', cursive"
        fontSize="52"
        fontWeight="700"
        fill="currentColor"
      >
        Zania
      </text>
    </svg>
  )
}
