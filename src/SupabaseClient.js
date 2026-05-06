import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcuqlstotpwfspithmro.supabase.co'
const supabaseKey = 'sb_publishable_ILz2hyDttbAczvwk5Gv5lQ_rhU_sS-R'

export const supabase = createClient(supabaseUrl, supabaseKey)
