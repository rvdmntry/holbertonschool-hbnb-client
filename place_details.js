document.addEventListener('DOMContentLoaded', () => {
    const placeId = getPlaceIdFromURL();
    checkAuthentication(placeId);
});

function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function checkAuthentication(placeId) {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');
    if (!token) {
        addReviewSection.style.display = 'none';
    } else {
        addReviewSection.style.display = 'block';
        fetchPlaceDetails(token, placeId);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`https://your-api-url/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            console.error('Failed to fetch place details:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    placeDetails.innerHTML = '';
    const placeItem = document.createElement('div');
    placeItem.className = 'place-info';
    placeItem.innerHTML = `
        <img src="${place.image}" class="place-image-large" alt="${place.name}">
        <h2>${place.name}</h2>
        <p>${place.description}</p>
        <p>Location: ${place.location}</p>
        <p>Host: ${place.host}</p>
        <h3>Amenities</h3>
        <ul>${place.amenities.map(amenity => `<li>${amenity}</li>`).join('')}</ul>
    `;
    placeDetails.appendChild(placeItem);
}

document.getElementById('review-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const token = getCookie('token');
    const placeId = getPlaceIdFromURL();
    const reviewText = document.getElementById('review-text').value;

    try {
        const response = await fetch(`https://your-api-url/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ review: reviewText })
        });
        if (response.ok) {
            alert('Review added successfully!');
            location.reload();
        } else {
            console.error('Failed to add review:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
