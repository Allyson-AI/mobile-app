import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Text } from "react-native";
import { cn } from "~/lib/utils";

const TextClassContext = React.createContext(undefined);

const Text = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : Text;
    return (
      <Component
        className={cn(
          "text-base text-foreground web:select-text",
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, TextClassContext };
