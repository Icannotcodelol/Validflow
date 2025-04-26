import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The AI analysis helped me identify gaps in my marketing strategy that I hadn't considered. The insights were spot-on and actionable.",
    author: "Sarah M.",
    role: "Marketing Director"
  },
  {
    quote: "What impressed me most was how quickly I got comprehensive market insights. It saved me weeks of research and gave me confidence in my approach.",
    author: "Michael R.",
    role: "Startup Founder"
  },
  {
    quote: "The validation report highlighted potential challenges I hadn't thought of. It helped me pivot my strategy before making costly mistakes.",
    author: "David L.",
    role: "Product Manager"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real feedback from entrepreneurs and marketers who've used ValiNow to validate their strategies
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card p-6 rounded-lg shadow-sm border"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="pt-4 border-t">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 