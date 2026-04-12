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

export function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" badge="Legal">
      <p>Last updated: April 2026</p>
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as name, email address, shipping address, and payment information when you place an order.</p>
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to process orders, send order confirmations, provide customer support, and improve our services.</p>
      <h2>3. Information Sharing</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties except as required to fulfill your orders (e.g., delivery partners).</p>
      <h2>4. Data Security</h2>
      <p>We implement industry-standard security measures to protect your personal information. All data is transmitted using SSL encryption.</p>
      <h2>5. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@teklito.com.</p>
    </StaticPage>
  );
}
export default PrivacyPage;
