import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Shipping typically takes 2-3 business days within the UAE. International shipping varies by location but generally takes 7-10 business days."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 14-day return policy for unused products in their original packaging. Please visit our Returns page for more details."
        },
        {
            question: "Do you offer warranty on products?",
            answer: "Yes, all our electronic products come with a 1-year limited warranty against manufacturing defects."
        },
        {
            question: "Are your phone cases MagSafe compatible?",
            answer: "Most of our premium cases are MagSafe compatible. Please check the product description for specific compatibility details."
        },
        {
            question: "How can I track my order?",
            answer: "You can track your order by clicking on the 'Track Order' link in the footer and entering your Order ID."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 font-poppins">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Support Center</p>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Frequently Asked Questions</h1>
                    <p className="text-zinc-500 font-medium">Everything you need to know about TEKLITO products and services.</p>
                </div>

                <div className="bg-white border border-zinc-100 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-zinc-200/50">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-b-zinc-100 py-2">
                                <AccordionTrigger className="text-left font-bold text-zinc-900 hover:text-black hover:no-underline text-base md:text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-500 font-medium leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-zinc-500 font-medium mb-4">Still have questions?</p>
                    <a href="/contact" className="inline-block px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-lg shadow-black/10">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
