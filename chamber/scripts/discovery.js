document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = `Last Modified: ${document.lastModified}`;
    sendVisitMessage();
    loadPlaces();
});

function sendVisitMessage() {
    const visitMessage = document.getElementById('visit-message');
    const currentDate = Date.now();
    const lastVisit = localStorage.getItem('lastVisitDate');

    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions."
    } else {
        const daysDifference = Math.floor((currentDate - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));

        if (daysDifference < 1) {
            visitMessage.textContent = "Back so soon! Awesome!"
        } else {
            visitMessage.textContent = `You last visited ${daysDifference} days ago.`
        }
    }
    localStorage.setItem('lastVisit', currentDate);
}

async function loadPlaces() {
    try {
        const response = await fetch('data/discover.json');
        if (!response.ok) {
          throw new Error('Failed to fetch places data');
        }

        const data = await response.json();
        const placesContainer = document.querySelector('.discover-grid');

        data.places.forEach(place => {
            const placeCard = createPlaceCard(place);
            placesContainer.appendChild(placeCard);
          });

    } catch (error) {
        console.error('Error loading places data:', error);
        document.querySelector('.discover-grid').innerHTML = '<p class="error-message">Sorry, we couldn\'t load the points of interest.</p>';
    }
}

function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';
    
    card.innerHTML = `
      <div class="place-image">
        <figure>
          <img src="${place.image}" alt="${place.name}" loading="lazy">
        </figure>
      </div>
      <div class="place-info">
        <h2>${place.name}</h2>
        <address>${place.address}</address>
        <p>${place.description}</p>
        <button>Learn More</button>
      </div>
    `;
    
    card.querySelector('button').addEventListener('click', () => {
      alert(`You clicked to learn more about ${place.name}.`);
    });
    
    return card;
  }