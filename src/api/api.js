import supabase from './supabaseClient';

// Pobiera wszystkie zestawy słów z bazy danych
export const fetchWordsets = async () => {
  // Wykonuje zapytanie do bazy danych Supabase
  const { data: wordsets, error } = await supabase.from('finaltest').select('*');

  // Loguje błąd, jeśli wystąpi podczas pobierania danych
  if (error) {
    console.error('Błąd podczas pobierania zestawów słów:', error);
    return null; // Zwraca null jako sygnał niepowodzenia operacji
  }

  // Zwraca pobrane zestawy słów, jeśli operacja się powiedzie
  return wordsets;
};

// Pobiera terminy z bazy danych na podstawie kategorii
export const fetchTermsByCategory = async (category) => {
  // Wykonuje zapytanie do bazy danych Supabase z filtrem dla konkretnej kategorii
  const { data: terms, error } = await supabase.from('finaltest').select('*').eq('category', category);

  // Loguje błąd, jeśli wystąpi podczas pobierania danych dla danej kategorii
  if (error) {
    console.error(`Błąd podczas pobierania terminów dla kategorii ${category}:`, error);
    return []; // Zwraca pustą tablicę jako sygnał niepowodzenia operacji
  }

  // Zwraca pobrane terminy, jeśli operacja się powiedzie
  return terms;
};

// Dodaje zestaw słów do ulubionych użytkownika
export const addFavorite = async (userId, category) => {
  const { error } = await supabase.from('user_favorites').insert([{ user_id: userId, category }]);

  if (error) {
    console.error('Error adding favorite:', error);
    return false;
  }

  return true;
};

// Usuwa zestaw słów z ulubionych użytkownika
export const removeFavorite = async (userId, category) => {
  const { error } = await supabase.from('user_favorites').delete().match({ user_id: userId, category });

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }

  return true;
};

// Pobiera ulubione zestawy słów użytkownika
export const fetchFavorites = async (userId) => {
  const { data, error } = await supabase.from('user_favorites').select('category').eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  return data.map((fav) => fav.category);
};
