import { supabase } from '../lib/supabase';

export const fetchAppData = async appId => {
  const { data, error } = await supabase
    .from('portal_apps')
    .select('*')
    .eq('id', appId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
