import { cva } from "class-variance-authority";
import * as React from "react";
import { View } from "react-native";
import * as Slot from "~/components/primitives/slot";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/typography";
const badgeVariants = cva(
  "web:inline-flex items-center rounded-md border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary web:hover:opacity-80 active:opacity-80",
        secondary:
          "border-transparent bg-secondary web:hover:opacity-80 active:opacity-80",
        destructive:
          "border-transparent bg-destructive web:hover:opacity-80 active:opacity-80",
        outline: "text-foreground border-zinc-700/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
const badgeTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
function Badge({ className, variant, asChild, ...props }) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}
export { Badge, badgeTextVariants, badgeVariants };
