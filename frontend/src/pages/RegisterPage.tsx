import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, { message: 'Passwords do not match', path: ['password_confirmation'] });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: authRegister, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authRegister(data);
      toast.success('Account created! Welcome to Teklito.');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Registration failed');
    }
  };

  const inputClass = 'h-12 rounded-[5px] border-zinc-200 bg-zinc-50 focus:border-black focus:ring-0 text-sm font-medium placeholder:text-zinc-400';
  const labelClass = 'text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block';
  const errClass = 'text-red-500 text-[10px] mt-1 font-medium';

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-zinc-100 p-8 md:p-10 shadow-xl shadow-black/5">
          <div className="text-center mb-8">
            <img src="/images/teklito-logo.webp" alt="Teklito" className="h-8 w-auto mx-auto mb-6" />
            <h1 className="text-xl font-black uppercase tracking-tight text-black">Create Account</h1>
            <p className="text-zinc-400 text-sm font-medium mt-1">Join Teklito today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className={labelClass}>Full Name</Label>
              <Input {...register('name')} placeholder="John Doe" className={inputClass} />
              {errors.name && <p className={errClass}>{errors.name.message}</p>}
            </div>
            <div>
              <Label className={labelClass}>Email</Label>
              <Input {...register('email')} type="email" placeholder="you@example.com" className={inputClass} />
              {errors.email && <p className={errClass}>{errors.email.message}</p>}
            </div>
            <div>
              <Label className={labelClass}>Phone (Optional)</Label>
              <Input {...register('phone')} placeholder="+971 50 000 0000" className={inputClass} />
            </div>
            <div>
              <Label className={labelClass}>Password</Label>
              <div className="relative">
                <Input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" className={cn(inputClass, 'pr-12')} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className={errClass}>{errors.password.message}</p>}
            </div>
            <div>
              <Label className={labelClass}>Confirm Password</Label>
              <Input {...register('password_confirmation')} type="password" placeholder="Repeat password" className={inputClass} />
              {errors.password_confirmation && <p className={errClass}>{errors.password_confirmation.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-black transition-all mt-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-[11px] font-medium text-zinc-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-black hover:text-primary transition-colors underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
