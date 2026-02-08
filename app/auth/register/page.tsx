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
import { ShieldCheck, Package, ArrowRight, UserCircle, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { getRandomAvatarName } from '@/lib/utils/avatars';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.name,
                    phone: formData.phone,
                },
            },
        });

        if (authError) {
            toast.error(authError.message);
            setIsLoading(false);
            return;
        }

        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    full_name: formData.name,
                    phone: formData.phone,
                    avatar_name: getRandomAvatarName()
                });

            if (profileError) {
                console.error('Error creating profile:', profileError);
            }

            toast.success('Initialize Successful. Please verify your email.');
            router.push('/auth/login');
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-zinc-50/30 min-h-screen pt-2 md:pt-12 pb-8 px-4 flex flex-col items-center justify-start font-poppins">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-4xl bg-white rounded-xl md:rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 flex flex-col md:flex-row min-h-[600px]"
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
                            <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </motion.div>

                        <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter mb-1 md:mb-2 leading-none">Join <span className="text-primary italic">Teklito.</span></h2>
                        <p className="text-zinc-500 font-medium text-[10px] md:text-xs">Secure identity setup.</p>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10 hidden md:block">
                        {[
                            { icon: ShieldCheck, text: "Verified Protection" },
                            { icon: Package, text: "Global Fulfillment" },
                            { icon: ArrowRight, text: "Priority Queuing" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Decor */}
                    <div className="absolute -bottom-10 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                </div>

                {/* Form Side */}
                <div className="md:w-[60%] p-6 md:p-10 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
                    <div className="mb-4 md:mb-6">
                        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black mb-1">Register</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Join the network</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</Label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="h-11 pl-10 bg-zinc-50 border-zinc-100 rounded-lg focus-visible:ring-black transition-all text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="phone" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+971..."
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="h-11 pl-10 bg-zinc-50 border-zinc-100 rounded-lg focus-visible:ring-black transition-all text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="user@teklito.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="h-11 pl-10 bg-zinc-50 border-zinc-100 rounded-lg focus-visible:ring-black transition-all text-xs"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="h-11 pl-10 bg-zinc-50 border-zinc-100 rounded-lg focus-visible:ring-black transition-all text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Confirm</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="h-11 pl-10 bg-zinc-50 border-zinc-100 rounded-lg focus-visible:ring-black transition-all text-xs"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-black text-primary hover:bg-zinc-900 rounded-xl font-black uppercase tracking-widest text-[10px] mt-4 shadow-xl shadow-black/5 flex items-center justify-center gap-2 group"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Initialize Identity'}
                            {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                        </Button>
                    </form>

                    <div className="mt-auto pt-4 md:pt-6 border-t border-zinc-50 flex flex-col items-center gap-4">
                        <p className="text-center text-[9px] text-zinc-400 px-4">
                            By joining, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy</span>.
                        </p>

                        <Link
                            href="/auth/login"
                            className="text-black hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px] border-b-2 border-primary"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
