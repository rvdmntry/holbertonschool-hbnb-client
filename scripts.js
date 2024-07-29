document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    const countryFilter = document.getElementById('country-filter');
    countryFilter.addEventListener('change', filterPlacesByCountry);
});

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('https://your-api-url/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            displayPlaces(data.places);
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';
    places.forEach(place => {
        const placeItem = document.createElement('div');
        placeItem.className = 'place-card';
        placeItem.innerHTML = `
            <img src="${place.image}" class="place-image" alt="${place.name}">
            <h2>${place.name}</h2>
            <p>Price: $${place.price} per night</p>
            <p>Location: ${place.location}</p>
            <button class="details-button" onclick="viewPlaceDetails(${place.id})">View Details</button>
        `;
        placesList.appendChild(placeItem);
    });
}

function filterPlacesByCountry(event) {
    const selectedCountry = event.target.value;
    const placeCards = document.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        const location = card.querySelector('p:nth-of-type(2)').textContent;
        if (selectedCountry === '' || location.includes(selectedCountry)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function viewPlaceDetails(placeId) {
    window.location.href = `place.html?id=${placeId}`;
}
