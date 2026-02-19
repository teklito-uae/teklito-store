export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 font-poppins">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Customer Support</p>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Shipping<br />Information</h1>
                    <div className="h-2 w-20 bg-black" />
                </div>

                <div className="prose prose-zinc max-w-none space-y-12">
                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">Domestic (UAE)</h2>
                            <p className="text-zinc-500 font-medium leading-relaxed mb-4">
                                Standard delivery within 2-3 business days.
                            </p>
                            <div className="flex justify-between items-center py-3 border-b border-zinc-200">
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Standard</span>
                                <span className="font-bold text-zinc-900">AED 15.00</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Order over AED 200</span>
                                <span className="font-black text-black">FREE</span>
                            </div>
                        </div>

                        <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">International</h2>
                            <p className="text-zinc-500 font-medium leading-relaxed mb-4">
                                Global shipping to over 50 countries.
                            </p>
                            <div className="flex justify-between items-center py-3 border-b border-zinc-200">
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Standard</span>
                                <span className="font-bold text-zinc-900">From AED 50.00</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Express (DHL)</span>
                                <span className="font-bold text-zinc-900">From AED 90.00</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">Order Tracking</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            Once your order has shipped, you will receive an email with a tracking number. You can also track your order directly on our website using your order ID.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">Processing Time</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
