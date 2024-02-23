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
  const { data: terms, error } = await supabase.from('finaltest').select('*').eq('category', category);

  if (error) {
    console.error(`Błąd podczas pobierania terminów dla kategorii ${category}:`, error);
    return [];
  }

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

// Pobiera postęp użytkownika dla określonej kategorii
export const fetchUserProgress = async (userId, category) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category);

    if (error) throw error;

    // Zwraca dane postępu użytkownika lub pustą tablicę, jeśli nie ma danych
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return { data: null, error };
  }
};

// Aktualizuje postęp użytkownika dla określonej kategorii i terminu
export const updateUserProgress = async (userId, category, termId, incrementCorrectAttempts) => {
  try {
    // Pobiera aktualny postęp użytkownika dla określonej kategorii i terminu
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('correct_attempts')
      .eq('user_id', userId)
      .eq('category', category)
      .eq('term_id', termId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    let newCorrectAttempts = currentProgress ? currentProgress.correct_attempts : 0;
    let completed = currentProgress ? currentProgress.completed : false;

    // Inkrementuje liczbę poprawnych prób, jeśli jest to wymagane
    if (incrementCorrectAttempts) {
      newCorrectAttempts++;
    }

    // Oznacza termin jako ukończony, jeśli użytkownik uzyskał co najmniej 3 poprawne próby
    if (newCorrectAttempts >= 3 && !completed) {
      completed = true;
    }

    // Aktualizuje postęp użytkownika w bazie danych
    const { error } = await supabase.from('user_progress').upsert(
      {
        user_id: userId,
        category: category,
        term_id: termId,
        correct_attempts: newCorrectAttempts,
        completed: completed,
        last_attempt: new Date().toISOString(),
      },
      {
        onConflict: 'user_id, category, term_id',
      }
    );

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return { error };
  }
};

// Resetuje postęp użytkownika dla określonej kategorii
export const resetUserProgress = async (userId, category) => {
  try {
    const { error } = await supabase
      .from('user_progress')
      .update({ correct_attempts: 0, completed: false })
      .match({ user_id: userId, category: category });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error resetting user progress:', error);
    return { error };
  }
};
