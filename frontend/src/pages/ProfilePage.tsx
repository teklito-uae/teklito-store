import { useAuthStore } from '@/lib/store/auth';
import { Package, Heart, MapPin, User, LogOut, ChevronRight, Settings, Shield, Bell, CreditCard, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'boring-avatars';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: 'Shopping Account',
      items: [
        { label: 'My Orders', icon: Package, to: '/orders', color: 'text-blue-500' },
        { label: 'Wishlist', icon: Heart, to: '/wishlist', color: 'text-rose-500' },
        { label: 'Saved Addresses', icon: MapPin, to: '#', color: 'text-emerald-500' },
      ]
    },
    {
      title: 'Personalization',
      items: [
        { label: 'Profile Settings', icon: User, to: '#', color: 'text-purple-500' },
        { label: 'Notifications', icon: Bell, to: '#', color: 'text-amber-500' },
        { label: 'Payment Methods', icon: CreditCard, to: '#', color: 'text-zinc-600' },
      ]
    },
    {
      title: 'Support & Security',
      items: [
        { label: 'Security', icon: Shield, to: '#', color: 'text-zinc-600' },
        { label: 'Privacy Policy', icon: Shield, to: '#', color: 'text-zinc-600' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-black pt-16 pb-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="h-24 w-24 rounded-[32px] overflow-hidden bg-zinc-800 p-0.5"
            >
              <div className="h-full w-full rounded-[30px] overflow-hidden">
                <Avatar
                  size={96}
                  name={user.avatar || user.name}
                  variant="pixel"
                  colors={["#0a0310","#49007e","#ff005b","#ff7d10","#ffb238"]}
                />
              </div>
            </motion.div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-1">
                {user.name}
              </h1>
              <p className="text-zinc-500 font-medium mb-4">{user.email}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-3">
                   <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                     <span className="text-[10px] font-black text-primary">T</span>
                   </div>
                   <div className="text-left">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 leading-none mb-1">Teklito Points</p>
                      <p className="text-xs font-black text-white leading-none">2,450</p>
                   </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-3">
                   <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                     <CreditCard className="h-3 w-3 text-emerald-500" />
                   </div>
                   <div className="text-left">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 leading-none mb-1">Wallet Balance</p>
                      <p className="text-xs font-black text-white leading-none">AED 0.00</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Menu */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="bg-white rounded-[32px] border border-zinc-100 p-6 shadow-sm overflow-hidden">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-2">
                  {group.title}
                </h2>
                <div className="space-y-1">
                  {group.items.map((item, i) => (
                    <Link
                      key={i}
                      to={item.to}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center transition-colors group-hover:bg-white border border-transparent group-hover:border-zinc-100", item.color.replace('text-', 'bg-').replace('500', '50'))}>
                          <item.icon className={cn("h-5 w-5", item.color)} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-black text-black uppercase tracking-tight">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-black transition-all group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Quick Stats/Actions */}
            <div className="bg-white rounded-[32px] border border-zinc-100 p-8 shadow-sm">
               <h3 className="text-sm font-black uppercase tracking-tight text-black mb-6">Need Support?</h3>
               <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">
                 Our premium support team is available 24/7 to help you with your tech needs.
               </p>
               <Button className="w-full h-12 rounded-xl bg-black text-white hover:bg-primary hover:text-black text-[10px] font-black uppercase tracking-widest transition-all">
                 Chat Now
               </Button>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-[32px] p-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-2xl text-rose-600 hover:bg-rose-100/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
                    <LogOut className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
