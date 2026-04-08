const API_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=Nigerian';
const LOCAL_DATA_URL = 'data/nigerian-dishes.json';

export async function fetchRecipes() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
            console.log(`API returned ${data.meals.length} recipes`);
        }

        throw new Error('Using local data for complete recipe details');

    } catch (error) {
        try {
            const response = await fetch(LOCAL_DATA_URL);

            if (!response.ok) {
                throw new Error(`Local data fetch failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.dishes;

        } catch (localError) {
            console.error('Failed to load recipes from local data:', localError);
            return [];
        }
    }
}

export function getRecipeById(id, recipes) {
    return recipes.find(recipe => recipe.id === parseInt(id)) || null;
}

export function filterByCategory(recipes, category) {
    if (category === 'all') return recipes;
    return recipes.filter(recipe => recipe.category === category);
}

export function filterByRegion(recipes, region) {
    if (region === 'all') return recipes;
    return recipes.filter(recipe => recipe.region === region);
}

export function filterByDifficulty(recipes, difficulty) {
    if (difficulty === 'all') return recipes;
    return recipes.filter(recipe => recipe.difficulty === difficulty);
}

export function applyFilters(recipes, filters) {
    let filtered = [...recipes];

    if (filters.category && filters.category !== 'all') {
        filtered = filterByCategory(filtered, filters.category);
    }

    if (filters.region && filters.region !== 'all') {
        filtered = filterByRegion(filtered, filters.region);
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
        filtered = filterByDifficulty(filtered, filters.difficulty);
    }

    return filtered;
}

export default {
    fetchRecipes,
    getRecipeById,
    filterByCategory,
    filterByRegion,
    filterByDifficulty,
    applyFilters
};
