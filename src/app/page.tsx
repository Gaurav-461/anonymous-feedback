"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-2 md:px-20 py-16">
      <section className="w-full max-md:text-center">
        <h1 className="text-4xl font-bold mb-4 text-center">
          🗣️ Where Words Flow Freely ✍️
        </h1>
        <p className="mt-3 md:mt-4 text-base text-center md:text-lg">
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      <section className="pt-16 md:mr-8">
        <Carousel
          className="max-w-60 md:max-w-md"
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="md:text-4xl text-center font-semibold">
                        {message.title}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  );
}
