import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6 px-4 text-center relative overflow-hidden">
      <div className="bg-cyber-grid absolute inset-0 opacity-10" />
      <div className="relative">
        <p className="text-[160px] font-black text-primary/10 leading-none select-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">404</p>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 relative">Error 404</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4 relative">Page Not Found</h1>
        <p className="text-zinc-400 text-sm md:text-base font-medium relative">The page you're looking for doesn't exist or has been moved.</p>
      </div>
      <Link to="/" className="relative inline-flex items-center gap-2 h-13 px-8 bg-primary text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all mt-4">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
