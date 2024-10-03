import { supabase } from './supabase';
export const getOrCreateUser = async (supabaseUser, userCredentials = {}) => {
  console.log('getOrCreateUser function started');
  // console.log('supabaseUser:', JSON.stringify(supabaseUser, null, 2));
  console.log('userCredentials:', JSON.stringify(userCredentials, null, 2));

  if (!supabaseUser || !supabaseUser.id) {
    console.error('Invalid supabaseUser object');
    throw new Error('Invalid supabaseUser object');
  }

  let userObject = {
    ...userCredentials,
  };
  console.log('User object created:', userObject);

  try {
    const { data: snapshot, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    console.log('Database query completed');

    if (error) {
      console.error('Error querying database:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      if (error.code !== 'PGRST116') {
        throw error;
      }
    }

    let tempUser = {
      ...userObject,
      id: supabaseUser.id,
    };

    if (!snapshot) {
      console.log('No user found, attempting to insert new user');
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([tempUser])
        .single();

      if (insertError) {
        console.error('Error inserting new user:', insertError);
        console.error('Error details:', JSON.stringify(insertError, null, 2));
        throw insertError;
      }
      console.log('New user inserted successfully:');
      return insertedUser;
    } else {
      // console.log('User found in database:', JSON.stringify(snapshot, null, 2));
      return snapshot;
    }
  } catch (error) {
    console.error('Error in getOrCreateUser function:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};
