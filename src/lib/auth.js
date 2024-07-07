import { supabase } from './supabase';

export const getOrCreateUser = async (supabaseUser, userCredentials = {}) => {
  let userObject = {
    ...userCredentials,
  };
  console.log(userCredentials);

  try {
    const { data: snapshot, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
    console.log({ snapshot });

    if (error && error.code !== 'PGRST116') {
      // 'PGRST116' is the code for "No rows returned"
      throw error;
    }

    let tempUser = {
      ...userObject,
      id: supabaseUser.id,
    };

    console.log({ supabaseUser, tempUser });

    if (!snapshot) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([tempUser]);

      if (insertError) {
        throw insertError;
      }
      return tempUser;
    } else {
      return snapshot;
    }
  } catch (error) {
    console.log(error);
  }
};
