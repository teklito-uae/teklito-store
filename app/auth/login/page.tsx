'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, Package, ArrowRight, UserCircle, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Access Granted');
            router.push('/');
            router.refresh();
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-zinc-50/30 min-h-screen pt-2 md:pt-12 pb-8 px-4 flex flex-col items-center justify-start font-poppins">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-4xl bg-white rounded-xl md:rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 flex flex-col md:flex-row min-h-[500px]"
            >
                {/* Visual Side */}
                <div className="md:w-[40%] bg-black p-6 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link href="/" className="inline-block mb-6 md:mb-10 translate-x-[-8px]">
                            <Image
                                src="/images/teklito-logo.webp"
                                alt="TEKLITO"
                                width={90}
                                height={28}
                                className="h-5 md:h-6 w-auto brightness-0 invert"
                            />
                        </Link>

                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 border border-primary/30"
                        >
                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </motion.div>

                        <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter mb-1 md:mb-2 leading-none">Vault <span className="text-primary italic">Access.</span></h2>
                        <p className="text-zinc-500 font-medium text-[10px] md:text-xs">Secure encryption enabled.</p>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10 hidden md:block">
                        {[
                            { icon: Package, text: "Sync Your Hardware" },
                            { icon: Lock, text: "End-to-End Privacy" },
                            { icon: ArrowRight, text: "Member Benefits" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Decor */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 blur-[80px] rounded-full" />
                </div>

                {/* Form Side */}
                <div className="md:w-[60%] p-6 md:p-12 flex flex-col">
                    <div className="mb-4 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black mb-1">Login</h1>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Initialize session</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                        <div className="space-y-1.5 md:space-y-2">
                            <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Identity</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@teklito.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 md:h-12 pl-10 bg-zinc-50 border-zinc-100 rounded-lg focus-visible:ring-black focus-visible:border-black transition-all text-xs font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Encryption</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-black transition-colors"
                                >
                                    Recovery?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 md:h-12 pl-10 bg-zinc-50 border-zinc-100 rounded-lg focus-visible:ring-black focus-visible:border-black transition-all text-xs font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-black text-primary hover:bg-zinc-900 rounded-xl font-black uppercase tracking-widest text-[10px] mt-4 shadow-xl shadow-black/5 flex items-center gap-2 group"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Decrypting...' : 'Authorize Session'}
                            {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                        </Button>
                    </form>

                    <div className="mt-auto pt-6 border-t border-zinc-50 flex flex-col items-center gap-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100" /></div>
                            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest text-zinc-300 bg-white px-4">New here?</div>
                        </div>

                        <Link
                            href="/auth/register"
                            className="text-black hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px] border-b-2 border-primary"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
