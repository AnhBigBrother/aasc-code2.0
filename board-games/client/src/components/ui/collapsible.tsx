import { cn } from "@/lib/utils";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { IconButton } from "./button";

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

type CollapsibleMenuProps = {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  label?: React.ReactNode;
};

const CollapsibleMenu = React.forwardRef<HTMLDivElement, CollapsibleMenuProps>(
  ({ children, className, label, open = false }, ref) => {
    const [isOpen, setisOpen] = useState<boolean>(open);
    return (
      <Collapsible open={isOpen} className={cn("w-full", className)} ref={ref}>
        <div className="flex flex-row items-center justify-between py-1">
          <CollapsibleTrigger
            asChild
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setisOpen((pre) => !pre);
            }}
          >
            <div className="flex w-full cursor-pointer items-center justify-between hover:underline">
              {label}
              <IconButton className="ml-2 rounded-md p-1">
                <ChevronDown
                  className={cn("h-5 w-5", {
                    "rotate-180": isOpen,
                  })}
                />
              </IconButton>
            </div>
          </CollapsibleTrigger>
        </div>
        {children}
      </Collapsible>
    );
  },
);
CollapsibleMenu.displayName = "CollapsibleMenu";

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleMenu };
