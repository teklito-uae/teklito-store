export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 font-poppins">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Legal Information</p>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Terms of<br />Service</h1>
                    <div className="h-2 w-20 bg-black" />
                </div>

                <div className="prose prose-zinc max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">1. Agreement to Terms</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            By accessing or using TEKLITO, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">2. Use License</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            Permission is granted to temporarily download one copy of the materials (information or software) on TEKLITO's website for personal, non-commercial transitory viewing only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">3. Disclaimer</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            The materials on TEKLITO's website are provided on an 'as is' basis. TEKLITO makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-4">4. Limitations</h2>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            In no event shall TEKLITO or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TEKLITO's website.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
