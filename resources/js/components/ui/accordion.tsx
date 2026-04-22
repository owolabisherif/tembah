import * as AccordionPrimitive from "@radix-ui/react-accordion"


function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.AccordionItem>) {
  return (
    <AccordionPrimitive.AccordionItem
      data-slot="accordion-header"
      {...props}
    />
  )
}

function AccordionHeader({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.AccordionHeader>) {
  return (
    <AccordionPrimitive.AccordionHeader
      data-slot="accordion-header"
      {...props}
    />
  )
}

function AccordionTrigger({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.AccordionTrigger>) {
  return (
    <AccordionPrimitive.AccordionTrigger
      data-slot="accordion-trigger"
      {...props}
    />
  )
}

function AccordionContent({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.AccordionContent>) {
  return (
    <AccordionPrimitive.AccordionContent
      data-slot="accordion-content"
      {...props}
    />
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionHeader, AccordionContent }
