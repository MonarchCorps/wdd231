import { places } from '../data/discover.mjs';

const gridAreas = ['card-a', 'card-b', 'card-c', 'card-d', 'card-e', 'card-f', 'card-g', 'card-h'];

const grid = document.querySelector('.discover-grid');

if (grid) {
    places.forEach((place, index) => {
        const card = document.createElement('article');
        card.classList.add('discover-card');
        card.style.gridArea = gridAreas[index];

        card.innerHTML = `
            <h2>${place.name}</h2>
            <figure>
                <img
                    src="images/${place.image}"
                    alt="${place.alt}"
                    width="300"
                    height="200"
                    loading="${index < 2 ? 'eager' : 'lazy'}">
            </figure>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button class="learn-more-btn" type="button">Learn More</button>
        `;

        grid.appendChild(card);
    });
}

const messageEl = document.getElementById('visitor-message');

if (messageEl) {
    const lastVisit = localStorage.getItem('lagosDiscoverLastVisit');
    const now = Date.now();
    let message = '';

    if (!lastVisit) {
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const msBetween = now - Number(lastVisit);
        const daysBetween = Math.floor(msBetween / (1000 * 60 * 60 * 24));

        if (daysBetween < 1) {
            message = 'Back so soon! Awesome!';
        } else {
            const dayWord = daysBetween === 1 ? 'day' : 'days';
            message = `You last visited ${daysBetween} ${dayWord} ago.`;
        }
    }

    messageEl.textContent = message;
    localStorage.setItem('lagosDiscoverLastVisit', now.toString());
}
