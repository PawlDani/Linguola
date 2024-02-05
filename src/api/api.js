import supabase from './supabaseClient';

export const fetchWordsets = async () => {
  const { data: wordsets, error } = await supabase.from('Wordsets').select('*');

  if (error) {
    console.error('Error fetching wordsets:', error);
    return null;
  }

  return wordsets;
};
