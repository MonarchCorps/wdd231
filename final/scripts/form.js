// form.js - Form handling and validation
// ES Module for contact form functionality

import { saveFormDraft, getFormDraft, clearFormDraft } from './storage.js';

/**
 * Initialize form functionality
 */
export function initForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return; // Not on contact page
    
    // Load draft data if exists
    loadFormDraft(form);
    
    // Save draft as user types
    setupAutosave(form);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Reset button
    const resetButton = form.querySelector('[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            clearFormDraft();
        });
    }
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleSubmit(e) {
    // Form will submit via GET method to thankyou.html
    // Clear draft on successful submission
    clearFormDraft();
}

/**
 * Setup autosave functionality
 * @param {HTMLFormElement} form - Form element
 */
function setupAutosave(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const formData = getFormData(form);
            saveFormDraft(formData);
        });
    });
}

/**
 * Get form data as object
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} Form data object
 */
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

/**
 * Load form draft from storage
 * @param {HTMLFormElement} form - Form element
 */
function loadFormDraft(form) {
    const draft = getFormDraft();
    
    if (!draft) return;
    
    // Populate form fields with draft data
    Object.keys(draft).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = draft[key] === 'yes';
            } else {
                input.value = draft[key];
            }
        }
    });
}

/**
 * Initialize thank you page
 */
export function initThankYouPage() {
    const formDataContainer = document.getElementById('form-data');
    
    if (!formDataContainer) return; // Not on thank you page
    
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    
    if (params.toString() === '') {
        formDataContainer.innerHTML = '<p>No submission data found.</p>';
        return;
    }
    
    // Display form data using template literals
    const dataHTML = createSubmissionDataHTML(params);
    formDataContainer.innerHTML = dataHTML;
}

/**
 * Create HTML for submission data display
 * @param {URLSearchParams} params - URL search parameters
 * @returns {string} HTML string
 */
function createSubmissionDataHTML(params) {
    const fieldLabels = {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        subject: 'Subject',
        region: 'Region',
        message: 'Message',
        newsletter: 'Newsletter Subscription'
    };
    
    let html = '<dl class="submission-data">';
    
    for (const [key, value] of params.entries()) {
        const label = fieldLabels[key] || key;
        const displayValue = formatValue(key, value);
        
        html += `
            <dt><strong>${label}:</strong></dt>
            <dd>${displayValue}</dd>
        `;
    }
    
    html += '</dl>';
    
    return html;
}

/**
 * Format value for display
 * @param {string} key - Field key
 * @param {string} value - Field value
 * @returns {string} Formatted value
 */
function formatValue(key, value) {
    if (key === 'subject') {
        return formatSubject(value);
    }
    
    if (key === 'region') {
        return formatRegion(value);
    }
    
    if (key === 'newsletter') {
        return value === 'yes' ? 'Yes, subscribed' : 'No';
    }
    
    return value || 'Not provided';
}

/**
 * Format subject value
 * @param {string} value - Subject value
 * @returns {string} Formatted subject
 */
function formatSubject(value) {
    const subjects = {
        'recipe-submission': 'Recipe Submission',
        'question': 'Cooking Question',
        'suggestion': 'Dish Suggestion',
        'partnership': 'Partnership Inquiry',
        'feedback': 'General Feedback',
        'other': 'Other'
    };
    
    return subjects[value] || value;
}

/**
 * Format region value
 * @param {string} value - Region value
 * @returns {string} Formatted region
 */
function formatRegion(value) {
    const regions = {
        'northern': 'Northern Nigeria',
        'southern': 'Southern Nigeria',
        'eastern': 'Eastern Nigeria',
        'western': 'Western Nigeria',
        'south-south': 'South-South Nigeria',
        'diaspora': 'Nigerian Diaspora',
        'international': 'International'
    };
    
    return regions[value] || value || 'Not specified';
}

/**
 * Add custom validation messages
 */
export function setupFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            
            if (input.validity.valueMissing) {
                input.setCustomValidity('This field is required.');
            } else if (input.validity.typeMismatch) {
                input.setCustomValidity('Please enter a valid value.');
            } else if (input.validity.tooShort) {
                input.setCustomValidity(`Please enter at least ${input.minLength} characters.`);
            }
        });
        
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });
}

export default {
    initForm,
    initThankYouPage,
    setupFormValidation
};
