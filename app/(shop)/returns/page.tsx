export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 font-poppins">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Customer Support</p>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Returns &<br />Exchanges</h1>
                    <div className="h-2 w-20 bg-black" />
                </div>

                <div className="prose prose-zinc max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">14-Day Return Policy</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            If you are not entirely satisfied with your purchase, we're here to help. You have 14 calendar days to return an item from the date you received it.
                        </p>
                    </section>

                    <section className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">Eligibility Criteria</h2>
                        <ul className="space-y-3 text-zinc-500 font-medium">
                            <li className="flex items-start gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                                The item must be unused and in the same condition that you received it.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                                Your item must be in the original packaging.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                                Your item needs to have the receipt or proof of purchase.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">Refund Process</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
