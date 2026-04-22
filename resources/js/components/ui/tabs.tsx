import { cn } from "@/lib/utils"
import * as TabPrimitive from "@radix-ui/react-tabs"
import { VariantProps } from "class-variance-authority"
import { toggleVariants } from "./toggle"

function Tab({
  className,
  orientation,
  defaultValue,
  children,
  ...props
}: React.ComponentProps<typeof TabPrimitive.Root>) {
  return (
    <TabPrimitive.Root
      data-slot="toggle-group"
      orientation={orientation}
      defaultValue={defaultValue}
      className={cn(
        "group/toggle-group flex items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
        {children}
    
    </TabPrimitive.Root>
  )
}

function TabList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabPrimitive.List>) {
  return (
    <TabPrimitive.List
      aria-label="tab-list"
      {...props}
    >
        {children}
    </TabPrimitive.List>
  )
}

function TabTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabPrimitive.Trigger>) {
  return (
    <TabPrimitive.Trigger
      aria-label="tab-trigger"
      value={value}
      {...props}
    >
        {children}
    </TabPrimitive.Trigger>
  )
}

function TabContent({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabPrimitive.Content>) {
  return (
    <TabPrimitive.Content
      aria-label="tab-content"
      value={value}
      {...props}
    >
        {children}
    </TabPrimitive.Content>
  )
}

export {Tab, TabList, TabTrigger, TabContent}