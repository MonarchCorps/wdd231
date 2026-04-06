import { fetchRecipes } from './api.js';
import {
    renderRecipes,
    renderFeaturedRecipes,
    renderRecentRecipes,
    filterAndRender,
    updateRecipeCount,
    setupLazyLoading
} from './recipes.js';
import { getRecentViews } from './storage.js';
import { initModal } from './modal.js';
import { initNavigation, initSmoothScroll } from './nav.js';
import { initForm, initThankYouPage, setupFormValidation } from './form.js';

let allRecipes = [];
let currentFilters = {
    category: 'all',
    region: 'all',
    difficulty: 'all'
};

async function init() {
    console.log('Initializing Naija Food Hub...');

    initNavigation();
    initSmoothScroll();
    initModal();
    updateFooter();

    const currentPage = getCurrentPage();

    if (currentPage === 'index.html' || currentPage === '') {
        await initHomePage();
    } else if (currentPage === 'recipes.html') {
        await initRecipesPage();
    } else if (currentPage === 'contact.html') {
        initContactPage();
    } else if (currentPage === 'thankyou.html') {
        initThankYouPage();
    }

}

async function initHomePage() {
    try {
        allRecipes = await fetchRecipes();

        const featuredContainer = document.getElementById('featured-dishes');
        if (featuredContainer) {
            renderFeaturedRecipes(allRecipes, featuredContainer);
        }

        const recentContainer = document.getElementById('recent-dishes');
        const recentSection = document.getElementById('recent-section');
        if (recentContainer && recentSection) {
            const recentRecipes = getRecentViews();
            renderRecentRecipes(recentRecipes, recentContainer, recentSection);
        }

        setupLazyLoading();

    } catch (error) {
        console.error('Error initializing home page:', error);
    }
}

async function initRecipesPage() {
    console.log('Initializing recipes page...');

    try {
        allRecipes = await fetchRecipes();

        const recipesContainer = document.getElementById('recipes-grid');
        const noResultsElement = document.getElementById('no-results');
        const recipeCountElement = document.getElementById('recipe-count');

        if (recipesContainer) {
            renderRecipes(allRecipes, recipesContainer);
            updateRecipeCount(allRecipes.length, recipeCountElement);
        }

        setupFilters(recipesContainer, noResultsElement, recipeCountElement);

        checkURLFilters();

        setupLazyLoading();

    } catch (error) {
        console.error('Error initializing recipes page:', error);
    }
}

function initContactPage() {
    console.log('Initializing contact page...');
    initForm();
    setupFormValidation();
}

function setupFilters(container, noResults, countElement) {
    const categoryFilter = document.getElementById('category-filter');
    const regionFilter = document.getElementById('region-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const resetButton = document.getElementById('reset-filters');

    // Category filter change
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentFilters.category = e.target.value;
            applyCurrentFilters(container, noResults, countElement);
        });
    }

    // Region filter change
    if (regionFilter) {
        regionFilter.addEventListener('change', (e) => {
            currentFilters.region = e.target.value;
            applyCurrentFilters(container, noResults, countElement);
        });
    }

    // Difficulty filter change
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', (e) => {
            currentFilters.difficulty = e.target.value;
            applyCurrentFilters(container, noResults, countElement);
        });
    }

    // Reset filters
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            resetFilters(categoryFilter, regionFilter, difficultyFilter);
            applyCurrentFilters(container, noResults, countElement);
        });
    }
}


function applyCurrentFilters(container, noResults, countElement) {
    const filtered = filterAndRender(allRecipes, currentFilters, container, noResults);
    updateRecipeCount(filtered.length, countElement);
}

/**
 * Reset all filters
 * @param {HTMLElement} categoryFilter - Category select
 * @param {HTMLElement} regionFilter - Region select
 * @param {HTMLElement} difficultyFilter - Difficulty select
 */
function resetFilters(categoryFilter, regionFilter, difficultyFilter) {
    currentFilters = {
        category: 'all',
        region: 'all',
        difficulty: 'all'
    };

    if (categoryFilter) categoryFilter.value = 'all';
    if (regionFilter) regionFilter.value = 'all';
    if (difficultyFilter) difficultyFilter.value = 'all';
}

/**
 * Check URL for filter parameters
 */
function checkURLFilters() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    if (category) {
        currentFilters.category = category;
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = category;
            applyCurrentFilters(
                document.getElementById('recipes-grid'),
                document.getElementById('no-results'),
                document.getElementById('recipe-count')
            );
        }
    }
}

function updateFooter() {
    const yearElement = document.getElementById('currentyear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const modifiedElement = document.getElementById('lastModified');
    if (modifiedElement) {
        const lastModified = new Date(document.lastModified);
        modifiedElement.textContent = `Last Updated: ${lastModified.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    return page || 'index.html';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default {
    init,
    allRecipes,
    currentFilters
};
