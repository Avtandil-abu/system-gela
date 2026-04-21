import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://rnnheqfvlysczcudecnt.supabase.co'

const supabaseAnonKey = 'sb_publishable_d7LH3LCYmaHQldkeOTeVlw_j2AlMFwy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)