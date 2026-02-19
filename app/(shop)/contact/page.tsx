'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Message sent successfully!', {
                description: "We'll get back to you within 24 hours."
            });
        }, 1500);
    };

    const contactInfo = [
        { icon: Mail, label: 'Email Us', value: 'support@teklito.com', sub: '24/7 Priority Support' },
        { icon: Phone, label: 'Call Us', value: '+971 50 123 4567', sub: 'Mon-Fri, 9am - 6pm' },
        { icon: MapPin, label: 'Visit Us', value: 'Dubai, UAE', sub: 'Business Bay, Tower 1' },
    ];

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 font-poppins">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Get In Touch</h1>
                    <p className="text-zinc-500 max-w-xl mx-auto font-medium">Have a question about our products or your order? Our team is here to help you 24/7.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((item, i) => (
                            <Card key={i} className="border-zinc-100 shadow-sm rounded-3xl group hover:border-black transition-all duration-300">
                                <CardContent className="p-6 flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{item.label}</p>
                                        <p className="font-bold text-zinc-900">{item.value}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{item.sub}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-zinc-100 shadow-2xl shadow-zinc-200/50 rounded-[3rem] overflow-hidden">
                            <CardContent className="p-8 md:p-12">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                                            <Input
                                                placeholder="John Doe"
                                                className="h-14 bg-zinc-50 border-zinc-100 rounded-2xl font-bold focus:bg-white transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                className="h-14 bg-zinc-50 border-zinc-100 rounded-2xl font-bold focus:bg-white transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Subject</label>
                                        <Input
                                            placeholder="Order Inquiry"
                                            className="h-14 bg-zinc-50 border-zinc-100 rounded-2xl font-bold focus:bg-white transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Message</label>
                                        <textarea
                                            className="w-full min-h-[150px] p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                            placeholder="How can we help you?"
                                            required
                                        ></textarea>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-black/10 gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
