"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full px-2",
        className
      )}
      {...props}
    >
      <div className="w-full h-full overflow-hidden rounded-full">
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary h-full transition-all duration-300 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </ProgressPrimitive.Root>
  );
}

export { Progress };