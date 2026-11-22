// Account sync settings: the Supabase project that stores progress.
// Both values are meant to be public. The anon key can only do what the
// row-level security rules in supabase/schema.sql allow (each user: their own row).
// Leave them empty to run without accounts; progress then stays on the device.
window.TRUECOUNT_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
