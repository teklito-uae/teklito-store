function StaticPage({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-16 relative overflow-hidden">
        <div className="bg-cyber-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">{badge}</p>
          <h1 className="text-4xl font-black uppercase tracking-tight">{title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-zinc prose-sm md:prose-base">
        {children}
      </div>
    </div>
  );
}

export function ReturnsPage() {
  return (
    <StaticPage title="Returns & Refunds" badge="Policy">
      <h2>Return Eligibility</h2>
      <p>Items may be returned within <strong>7 days</strong> of delivery. Products must be unused, in original packaging, with all accessories and documentation.</p>
      <h2>How to Return</h2>
      <ol>
        <li>Contact our support team at support@teklito.com with your order number.</li>
        <li>Our team will arrange a pickup from your address (within UAE).</li>
        <li>Once received and inspected, your refund will be processed within 5-7 business days.</li>
      </ol>
      <h2>Non-Returnable Items</h2>
      <p>The following items cannot be returned: opened software, items damaged by misuse, and items without original packaging.</p>
      <h2>Refund Method</h2>
      <p>Refunds are issued via the original payment method. For COD orders, bank transfer will be arranged.</p>
    </StaticPage>
  );
}
export default ReturnsPage;
