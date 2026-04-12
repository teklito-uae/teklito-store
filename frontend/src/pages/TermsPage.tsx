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

export function TermsPage() {
  return (
    <StaticPage title="Terms of Service" badge="Legal">
      <p>Last updated: April 2026. By using Teklito, you agree to these terms.</p>
      <h2>1. Use of Service</h2>
      <p>You must be at least 18 years of age to use this service. You are responsible for maintaining the security of your account credentials.</p>
      <h2>2. Orders & Payments</h2>
      <p>All prices are in AED (United Arab Emirates Dirham). We reserve the right to cancel any order that appears fraudulent or erroneous.</p>
      <h2>3. Product Information</h2>
      <p>We strive to display product information accurately, but we do not warrant that product descriptions or other content is accurate, complete, or error-free.</p>
      <h2>4. Intellectual Property</h2>
      <p>All content on this site, including logos, images, and text, is the property of Teklito and protected by applicable intellectual property laws.</p>
      <h2>5. Limitation of Liability</h2>
      <p>Teklito shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our services.</p>
      <h2>6. Contact</h2>
      <p>For questions about these terms, contact us at legal@teklito.com.</p>
    </StaticPage>
  );
}
export default TermsPage;
