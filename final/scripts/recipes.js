import { isFavorite, toggleFavorite, addRecentView } from './storage.js';
import { openModal } from './modal.js';

export function createRecipeCard(recipe) {
    const favorited = isFavorite(recipe.id);
    const favClass = favorited ? 'favorited' : '';
    const difficultyClass = `difficulty-${recipe.difficulty.toLowerCase()}`;
    
    return `
        <article class="recipe-card" data-recipe-id="${recipe.id}">
            <div class="recipe-card-image">
                <img src="${recipe.image}" 
                     alt="${recipe.name}" 
                     loading="lazy"
                     width="800"
                     height="450">
            </div>
            <div class="recipe-card-content">
                <div class="recipe-card-header">
                    <h3>${recipe.name}</h3>
                    <button class="favorite-button ${favClass}" 
                            data-recipe-id="${recipe.id}"
                            aria-label="Toggle favorite"
                            title="${favorited ? 'Remove from favorites' : 'Add to favorites'}">
                        ${favorited ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="recipe-card-meta">
                    <span class="meta-badge category">${recipe.category}</span>
                    <span class="meta-badge">${recipe.region}</span>
                    <span class="meta-badge ${difficultyClass}">${recipe.difficulty}</span>
                </div>
                <p class="recipe-card-description">${recipe.description}</p>
                <div class="recipe-card-footer">
                    <span>⏱️ ${recipe.cookTime}</span>
                    <button class="view-recipe-btn" data-recipe-id="${recipe.id}">
                        View Recipe
                    </button>
                </div>
            </div>
        </article>
    `;
}

export function renderRecipes(recipes, container) {
    if (!container) {
        console.error('Container element not found');
        return;
    }
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = '<p class="no-results">No recipes found.</p>';
        return;
    }
    
    const recipesHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
    container.innerHTML = recipesHTML;
    
    attachRecipeCardListeners(container, recipes);
}


export function renderFeaturedRecipes(recipes, container) {
    if (!container) return;
    
    const featured = recipes.slice(0, 6);
    renderRecipes(featured, container);
}

export function renderRecentRecipes(recentRecipes, container, section) {
    if (!container || !section) return;
    
    if (recentRecipes.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    renderRecipes(recentRecipes, container);
}

function attachRecipeCardListeners(container, recipes) {
    const favoriteButtons = container.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', handleFavoriteClick);
    });
    
    const viewButtons = container.querySelectorAll('.view-recipe-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const recipeId = parseInt(button.dataset.recipeId);
            const recipe = recipes.find(r => r.id === recipeId);
            if (recipe) {
                addRecentView(recipe);
                openModal(recipe);
            }
        });
    });
    
    const cards = container.querySelectorAll('.recipe-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const recipeId = parseInt(card.dataset.recipeId);
            const recipe = recipes.find(r => r.id === recipeId);
            if (recipe) {
                addRecentView(recipe);
                openModal(recipe);
            }
        });
    });
}

function handleFavoriteClick(e) {
    e.stopPropagation(); 
    const button = e.currentTarget;
    const recipeId = parseInt(button.dataset.recipeId);
    
    const isFav = toggleFavorite(recipeId);
    
    if (isFav) {
        button.classList.add('favorited');
        button.innerHTML = '❤️';
        button.title = 'Remove from favorites';
    } else {
        button.classList.remove('favorited');
        button.innerHTML = '🤍';
        button.title = 'Add to favorites';
    }
}

export function filterAndRender(allRecipes, filters, container, noResultsElement) {
    let filtered = allRecipes.filter(recipe => {
        let match = true;
        
        if (filters.category && filters.category !== 'all') {
            match = match && recipe.category === filters.category;
        }
        
        if (filters.region && filters.region !== 'all') {
            match = match && recipe.region === filters.region;
        }
        
        if (filters.difficulty && filters.difficulty !== 'all') {
            match = match && recipe.difficulty === filters.difficulty;
        }
        
        return match;
    });
    
    if (filtered.length === 0 && noResultsElement) {
        noResultsElement.classList.remove('hidden');
        container.innerHTML = '';
    } else {
        if (noResultsElement) noResultsElement.classList.add('hidden');
        renderRecipes(filtered, container);
    }
    
    return filtered;
}

export function updateRecipeCount(count, element) {
    if (element) {
        element.textContent = count;
    }
}

export function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        } else {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                });
                imageObserver.observe(img);
            }
        }
    });
}

export default {
    createRecipeCard,
    renderRecipes,
    renderFeaturedRecipes,
    renderRecentRecipes,
    filterAndRender,
    updateRecipeCount,
    setupLazyLoading
};
