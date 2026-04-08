const THEMEALDB_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=Nigerian';

const LOCAL_DATA_URL = 'data/nigerian-dishes.json';

export async function fetchRecipes() {
    try {
        const apiResponse = await fetch(THEMEALDB_URL);

        if (!apiResponse.ok) {
            throw new Error(`TheMealDB responded with HTTP ${apiResponse.status}`);
        }

        const apiData = await apiResponse.json();

        if (!apiData.meals || apiData.meals.length === 0) {
            throw new Error(
                'TheMealDB returned no results for "Nigerian" — ' +
                'this cuisine area is not in their database. Using local data.'
            );
        }

        console.log(`TheMealDB returned ${apiData.meals.length} meals.`);
        return apiData.meals;

    } catch (error) {
        console.warn('External API unavailable:', error.message);
        console.info('Loading from local JSON data source...');

        try {
            const localResponse = await fetch(LOCAL_DATA_URL);

            if (!localResponse.ok) {
                throw new Error(`Local data fetch failed with HTTP ${localResponse.status}`);
            }

            const localData = await localResponse.json();
            console.log(`Successfully loaded ${localData.dishes.length} recipes from local data.`);
            return localData.dishes;

        } catch (localError) {
            console.error('All data sources failed. No recipes available.', localError);
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
