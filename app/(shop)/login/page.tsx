'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Auth is managed by WooCommerce/WordPress. 
        // Showing a "Coming Soon" or redirecting message for now as per current project focus.
        setTimeout(() => {
            setLoading(false);
            toast.info('Login via WordPress is coming soon.', {
                description: 'You can currently shop as a guest.'
            });
        }, 1000);
    };

    return (
        <div className="container mx-auto px-4 py-16 md:py-28 font-poppins">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3">Welcome Back</h1>
                    <p className="text-zinc-500 font-medium">Log in to your account to manage orders.</p>
                </div>

                <Card className="border-zinc-100 shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-12 h-14 bg-zinc-50 border-zinc-100 rounded-2xl font-bold focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Password</label>
                                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-12 pr-12 h-14 bg-zinc-50 border-zinc-100 rounded-2xl font-bold focus:bg-white transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-black/10 mt-2"
                            >
                                {loading ? 'Logging in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-zinc-100" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Or continue with</span>
                            <div className="flex-1 h-px bg-zinc-100" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <Button variant="outline" className="h-14 rounded-2xl border-zinc-100 font-bold gap-2 hover:bg-zinc-50">
                                <Chrome className="h-4 w-4" />
                                Google
                            </Button>
                            <Button variant="outline" className="h-14 rounded-2xl border-zinc-100 font-bold gap-2 hover:bg-zinc-50">
                                <Github className="h-4 w-4" />
                                GitHub
                            </Button>
                        </div>

                        <p className="text-center mt-10 text-xs font-medium text-zinc-500">
                            Don't have an account? <Link href="#" className="font-black text-black hover:underline uppercase tracking-widest ml-1">Sign Up</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
