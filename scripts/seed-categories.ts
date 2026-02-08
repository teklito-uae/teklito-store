
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Use service role if available, but anon might work if RLS allows or if I use service key
// Actually, I need service role to bypass RLS if there are policies.
// Checking .env.local for service role. 
// If not found, I'll try anon.

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
    { name: 'Gaming PCs', slug: 'gaming-pcs', icon: 'Monitor', description: 'High-performance gaming rigs' },
    { name: 'Consoles', slug: 'consoles', icon: 'Gamepad2', description: 'Latest gaming consoles' },
    { name: 'Headphones', slug: 'headphones', icon: 'Headphones', description: 'Premium audio experiences' },
    { name: 'Trending', slug: 'trending', icon: 'Zap', description: 'Hot items right now' },
    { name: 'AirPods Cases', slug: 'airpods-cases', icon: 'Box', description: 'Stylish protection for your pods' },
    { name: 'Speakers', slug: 'speakers', icon: 'Speaker', description: 'Portable and home audio' },
    { name: 'Tablets', slug: 'tablets', icon: 'Tablet', description: 'Productivity on the go' },
    { name: 'Accessories', slug: 'accessories', icon: 'Cable', description: 'Essential tech add-ons' },
    { name: 'Smart Home', slug: 'smart-home', icon: 'Home', description: 'Automate your life' },
    { name: 'Cameras', slug: 'cameras', icon: 'Camera', description: 'Capture the moment' },
    { name: 'Networking', slug: 'networking', icon: 'Wifi', description: 'Stay connected' },
    { name: 'Storage', slug: 'storage', icon: 'HardDrive', description: 'Secure your data' },
    { name: 'Components', slug: 'components', icon: 'Cpu', description: 'Build your own' },
    { name: 'Office', slug: 'office', icon: 'Briefcase', description: 'Work essentials' },
    { name: 'Software', slug: 'software', icon: 'Code', description: 'Digital solutions' }
];

async function seed() {
    console.log('Seeding categories...');
    const { error } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
    if (error) console.error('Error:', error);
    else console.log('Success!');
}

seed();
