import React from 'react';

interface Testimonial {
    name: string;
    text: string;
    role: string;
}

interface TestimonialsSectionProps {
    testimonials?: Testimonial[];
}

/**
 * Testimonials section component displaying client reviews
 * Features rotating testimonials with accessibility considerations
 */
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
    testimonials = [
        {
            name: "Sarah M.",
            text: "The best hair salon experience I've ever had! My extensions look so natural.",
            role: "Regular Client"
        },
        {
            name: "Zoe K.",
            text: "I've been coming to Instyle for over a year. Always impressed with the detail.",
            role: "VIP Client"
        },
        {
            name: "Amanda T.",
            text: "The coloring service is exceptional! They created the perfect shade for me.",
            role: "New Client"
        }
    ]
}) => {
    return (
        <section id="testimonials" className="py-20 bg-white" role="region" aria-labelledby="testimonials-heading">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900">
                        Client Love
                    </h2>
                    <p className="text-gray-600">
                        Don&apos;t just take our word for it.
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <article
                            key={index}
                            className="bg-[#F9F9F9] p-8 rounded-2xl relative"
                            role="article"
                            aria-label={`Testimonial from ${testimonial.name}`}
                        >
                            {/* Quote mark decoration */}
                            <div
                                className="text-6xl text-crimson-primary opacity-10 absolute top-4 left-4 font-serif"
                                aria-hidden="true"
                            >
                                &quot;
                            </div>

                            {/* Testimonial text */}
                            <blockquote className="text-gray-600 italic mb-6 relative z-10">
                                {testimonial.text}
                            </blockquote>

                            {/* Client info */}
                            <div className="flex items-center gap-4">
                                {/* Avatar placeholder */}
                                <div
                                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-crimson-primary"
                                    aria-hidden="true"
                                >
                                    {testimonial.name[0]}
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Trust indicators */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-8 bg-[#F9F9F9] px-8 py-4 rounded-full">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" aria-hidden="true"></div>
                            <span className="text-sm font-medium text-gray-700">500+ Happy Clients</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" aria-hidden="true"></div>
                            <span className="text-sm font-medium text-gray-700">5-Star Average Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" aria-hidden="true"></div>
                            <span className="text-sm font-medium text-gray-700">3+ Years Experience</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;