import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Automatically delete posts after their expiration date
export const deleteExpiredPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error deleting expired posts:', error);
  } else {
    console.log('Expired posts deleted:', data);
  }
};