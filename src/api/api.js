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
