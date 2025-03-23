
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-racing-red text-racing-white hover:bg-racing-red/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-racing-silver/30 bg-transparent text-racing-white hover:bg-racing-red/10 hover:text-racing-white hover:border-racing-red shadow-sm",
        secondary: "bg-racing-silver/20 text-racing-white hover:bg-racing-silver/30 shadow-sm",
        ghost: "text-racing-white hover:bg-racing-red/10 hover:text-racing-white",
        link: "text-racing-white underline-offset-4 hover:underline",
        blue: "bg-racing-blue text-racing-white hover:bg-racing-blue/90 shadow-sm",
        tab: "rounded-full bg-transparent text-racing-silver data-[state=active]:bg-racing-red data-[state=active]:text-racing-white hover:text-racing-white hover:bg-racing-red/20",
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
