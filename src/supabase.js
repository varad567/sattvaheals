import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://krpwzbjiipsvbvjqsmfg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtycHd6YmppaXBzdmJ2anFzbWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NjcxNTksImV4cCI6MjA4ODQ0MzE1OX0.ATleILCg1H5JRmJzRqvEM5H2t1p2w7XmJzwgguHKPRw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)