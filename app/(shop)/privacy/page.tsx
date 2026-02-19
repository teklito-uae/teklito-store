export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 font-poppins">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Legal Information</p>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Privacy<br />Policy</h1>
                    <div className="h-2 w-20 bg-black" />
                </div>

                <div className="prose prose-zinc max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">1. Data Collection</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            We collect information from you when you register on our site, place an order, or subscribe to our newsletter. This includes your name, email address, mailing address, phone number, and credit card information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">2. Use of Information</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            Any of the information we collect from you may be used to personalize your experience, improve our website, improve customer service, and process transactions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">3. Data Protection</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">4. Cookies</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and keep track of advertisements.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
