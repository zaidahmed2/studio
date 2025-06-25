import * as React from "react"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

export function ZaniaLogo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
        <Heart className="h-7 w-7 text-accent fill-accent" />
        <span className="text-3xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>Zania</span>
    </div>
  )
}
