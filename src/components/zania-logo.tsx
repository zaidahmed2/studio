import * as React from "react"
import { cn } from "@/lib/utils"

export function ZaniaLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 150 50"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-auto", className)}
      {...props}
    >
      <title>Zania Logo</title>
      <text
        x="5"
        y="40"
        fontFamily="'Great Vibes', cursive"
        fontSize="48"
        fontWeight="400"
        fill="currentColor"
      >
        Zania
      </text>
    </svg>
  )
}
