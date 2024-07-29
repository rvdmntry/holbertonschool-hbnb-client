document.addEventListener('DOMContentLoaded', function() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch('https://api.example.com/places', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const placesList = document.getElementById('places-list');
        data.places.forEach(place => {
            const placeItem = document.createElement('div');
            placeItem.className = 'place-card';
            placeItem.innerHTML = `
                <img src="${place.image}" class="place-image" alt="${place.name}">
                <h2>${place.name}</h2>
                <p>Price: $${place.price} per night</p>
                <p>Location: ${place.location}</p>
                <a href="place.html?id=${place.id}" class="details-button">View Details</a>
            `;
            placesList.appendChild(placeItem);
        });
    });
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
