import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});
type Form = z.infer<typeof schema>;

export default function ContactPage() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = async () => { await new Promise(r => setTimeout(r, 1000)); setDone(true); toast.success('Message sent!'); };

  const inputClass = 'h-12 rounded-[5px] border-zinc-200 bg-zinc-50 focus:border-black focus:ring-0 text-sm font-medium';
  const labelClass = 'text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block';

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-16 relative overflow-hidden">
        <div className="bg-cyber-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Get In Touch</p>
          <h1 className="text-4xl font-black uppercase tracking-tight">Contact Us</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-black mb-6">Contact Information</h2>
            <div className="space-y-5">
              {[{ icon: MapPin, label: 'Dubai, United Arab Emirates' }, { icon: Phone, label: '+971 50 000 0000' }, { icon: Mail, label: 'support@teklito.com' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-zinc-600 pt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            {done ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <CheckCircle className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest text-black">Message Sent!</h3>
                <p className="text-zinc-400 text-sm font-medium">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div><Label className={labelClass}>Name</Label><Input {...register('name')} className={inputClass} placeholder="John Doe" />{errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}</div>
                <div><Label className={labelClass}>Email</Label><Input {...register('email')} type="email" className={inputClass} placeholder="you@example.com" />{errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}</div>
                <div><Label className={labelClass}>Subject</Label><Input {...register('subject')} className={inputClass} placeholder="How can we help?" />{errors.subject && <p className="text-red-500 text-[10px] mt-1">{errors.subject.message}</p>}</div>
                <div><Label className={labelClass}>Message</Label><textarea {...register('message')} rows={5} className="w-full rounded-[5px] border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:border-black focus:ring-0 outline-none resize-none" placeholder="Your message..." />{errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message.message}</p>}</div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-black transition-all">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
