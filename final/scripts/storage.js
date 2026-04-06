const STORAGE_KEYS = {
    FAVORITES: 'naija-food-favorites',
    RECENT_VIEWS: 'naija-food-recent',
    PREFERENCES: 'naija-food-preferences',
    FORM_DRAFT: 'naija-food-form-draft'
};

const MAX_RECENT_ITEMS = 4;

export function getFavorites() {
    try {
        const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
}

export function addFavorite(recipeId) {
    try {
        const favorites = getFavorites();
        if (!favorites.includes(recipeId)) {
            favorites.push(recipeId);
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error adding favorite:', error);
        return false;
    }
}

export function removeFavorite(recipeId) {
    try {
        const favorites = getFavorites();
        const filtered = favorites.filter(id => id !== recipeId);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error removing favorite:', error);
        return false;
    }
}

export function toggleFavorite(recipeId) {
    const favorites = getFavorites();
    if (favorites.includes(recipeId)) {
        removeFavorite(recipeId);
        return false;
    } else {
        addFavorite(recipeId);
        return true;
    }
}

export function isFavorite(recipeId) {
    const favorites = getFavorites();
    return favorites.includes(recipeId);
}

export function getRecentViews() {
    try {
        const recent = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWS);
        return recent ? JSON.parse(recent) : [];
    } catch (error) {
        console.error('Error reading recent views:', error);
        return [];
    }
}

export function addRecentView(recipe) {
    try {
        let recent = getRecentViews();
        
        recent = recent.filter(r => r.id !== recipe.id);
        
        recent.unshift(recipe);
        
        if (recent.length > MAX_RECENT_ITEMS) {
            recent = recent.slice(0, MAX_RECENT_ITEMS);
        }
        
        localStorage.setItem(STORAGE_KEYS.RECENT_VIEWS, JSON.stringify(recent));
    } catch (error) {
        console.error('Error adding recent view:', error);
    }
}

export function clearRecentViews() {
    try {
        localStorage.removeItem(STORAGE_KEYS.RECENT_VIEWS);
    } catch (error) {
        console.error('Error clearing recent views:', error);
    }
}


export function getPreferences() {
    try {
        const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        return prefs ? JSON.parse(prefs) : {
            theme: 'light',
            defaultView: 'grid',
            itemsPerPage: 18
        };
    } catch (error) {
        console.error('Error reading preferences:', error);
        return {};
    }
}

export function savePreferences(preferences) {
    try {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

export function saveFormDraft(formData) {
    try {
        localStorage.setItem(STORAGE_KEYS.FORM_DRAFT, JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving form draft:', error);
    }
}

export function getFormDraft() {
    try {
        const draft = localStorage.getItem(STORAGE_KEYS.FORM_DRAFT);
        return draft ? JSON.parse(draft) : null;
    } catch (error) {
        console.error('Error reading form draft:', error);
        return null;
    }
}

export function clearFormDraft() {
    try {
        localStorage.removeItem(STORAGE_KEYS.FORM_DRAFT);
    } catch (error) {
        console.error('Error clearing form draft:', error);
    }
}

export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error('Error clearing all data:', error);
    }
}

export default {
    getFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getRecentViews,
    addRecentView,
    clearRecentViews,
    getPreferences,
    savePreferences,
    saveFormDraft,
    getFormDraft,
    clearFormDraft,
    clearAllData
};
