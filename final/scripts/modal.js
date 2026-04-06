let currentModal = null;

export function openModal(recipe) {
    const modal = document.getElementById('recipe-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
    }

    const modalContent = createModalContent(recipe);
    modalBody.innerHTML = modalContent;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    currentModal = modal;

    document.body.style.overflow = 'hidden';

    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.focus();
    }

    setupModalListeners(modal);
}

export function closeModal() {
    const modal = document.getElementById('recipe-modal');

    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    currentModal = null;
}

function createModalContent(recipe) {
    const difficultyClass = `difficulty-${recipe.difficulty.toLowerCase()}`;

    const ingredientsList = recipe.ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join('');

    return `
        <img src="${recipe.image}" 
             alt="${recipe.name}" 
             class="modal-image"
             loading="eager">
        
        <div class="modal-body-content">
            <div class="modal-header">
                <h2 id="modal-title" class="modal-title">${recipe.name}</h2>
                <div class="modal-meta">
                    <span class="meta-badge category">${recipe.category}</span>
                    <span class="meta-badge">${recipe.region}</span>
                    <span class="meta-badge ${difficultyClass}">${recipe.difficulty}</span>
                </div>
            </div>
            
            <div class="modal-section">
                <p class="recipe-description">${recipe.description}</p>
            </div>
            
            <div class="modal-section">
                <h4>📊 Recipe Information</h4>
                <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
                <p><strong>Cook Time:</strong> ${recipe.cookTime}</p>
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
            </div>
            
            <div class="modal-section">
                <h4>🛒 Ingredients</h4>
                <ul class="ingredients-list">
                    ${ingredientsList}
                </ul>
            </div>
            
            <div class="modal-section">
                <h4>💡 Cooking Tips</h4>
                <p>This ${recipe.name} is a beloved dish from ${recipe.region}. 
                ${recipe.difficulty === 'Easy' ? 'Perfect for beginners!' :
            recipe.difficulty === 'Medium' ? 'Requires some cooking experience.' :
                'Best attempted by experienced cooks.'}
                </p>
                <p>Serve hot with your favorite sides for an authentic Nigerian experience!</p>
            </div>
        </div>
    `;
}

function setupModalListeners(modal) {
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    const handleEscape = (e) => {
        if (e.key === 'Escape' && currentModal) {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };

    document.addEventListener('keydown', handleEscape);

    trapFocus(modal);
}

function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    };

    modal.addEventListener('keydown', handleTab);
}

export function initModal() {
    const modal = document.getElementById('recipe-modal');

    if (!modal) return;

    // Ensure modal is hidden initially
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

export default {
    openModal,
    closeModal,
    initModal
};
