import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-white text-black hover:bg-gray-100 px-4 py-2 shadow",
          className
        )}
        {...props}
      />
    );
  }
);
