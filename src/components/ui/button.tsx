
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-fove-red text-fove-white hover:bg-fove-red/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-fove-silver/30 bg-transparent text-fove-white hover:bg-fove-red/10 hover:text-fove-white hover:border-fove-red shadow-sm",
        secondary: "bg-fove-silver/20 text-fove-white hover:bg-fove-silver/30 shadow-sm",
        ghost: "text-fove-white hover:bg-fove-red/10 hover:text-fove-white",
        link: "text-fove-white underline-offset-4 hover:underline",
        blue: "bg-fove-blue text-fove-white hover:bg-fove-blue/90 shadow-sm",
        gold: "bg-fove-gold text-fove-black hover:bg-fove-gold/90 shadow-sm",
        green: "bg-green-500 text-white hover:bg-green-600 shadow-sm",
        purple: "bg-purple-500 text-white hover:bg-purple-600 shadow-sm",
        orange: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
        tab: "rounded-full bg-transparent text-fove-silver data-[state=active]:bg-fove-red data-[state=active]:text-fove-white hover:text-fove-white hover:bg-fove-red/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
