"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Travelside?</AccordionTrigger>
        <AccordionContent>
          Travelside is a modern travel booking platform that allows you to search and book flights, hotels, and more
          with flexible payment options including cryptocurrencies.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I book a flight?</AccordionTrigger>
        <AccordionContent>
          You can book a flight by searching for your desired destination and dates on our homepage, selecting the
          flight that best suits your needs, and completing the booking process.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          We accept a wide range of payment methods including credit/debit cards, PayPal, and various cryptocurrencies
          to provide maximum flexibility for our customers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Can I cancel or change my booking?</AccordionTrigger>
        <AccordionContent>
          Yes, you can cancel or change your booking through your account dashboard. Please note that cancellation
          policies vary depending on the airline and fare type.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>Is my personal information secure?</AccordionTrigger>
        <AccordionContent>
          Yes, we take data security very seriously. All personal information is encrypted and stored securely in
          compliance with international data protection regulations.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
