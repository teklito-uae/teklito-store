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

export function ShippingPage() {
  return (
    <StaticPage title="Shipping Policy" badge="Delivery">
      <h2>Delivery Areas</h2>
      <p>We deliver to all Emirates across the UAE: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.</p>
      <h2>Delivery Timeframes</h2>
      <ul>
        <li><strong>Dubai & Abu Dhabi:</strong> 1-2 business days</li>
        <li><strong>Other Emirates:</strong> 2-4 business days</li>
      </ul>
      <h2>Shipping Fees</h2>
      <p>Standard shipping is <strong>AED 20</strong>. Orders over <strong>AED 200</strong> qualify for <strong>FREE shipping</strong>.</p>
      <h2>Order Processing</h2>
      <p>Orders placed before 2:00 PM (GST) on business days are processed the same day. Orders placed after 2:00 PM or on weekends/holidays are processed the next business day.</p>
      <h2>Tracking</h2>
      <p>Once your order is shipped, you will receive a tracking number via SMS and email. You can also track your order using our Track Order page.</p>
    </StaticPage>
  );
}
export default ShippingPage;
