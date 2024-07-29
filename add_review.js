document.addEventListener('DOMContentLoaded', () => {
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const reviewText = document.getElementById('review-text').value;
            await submitReview(token, placeId, reviewText);
        });
    }
});

function checkAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
    }
    return token;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('place_id');
}

async function submitReview(token, placeId, reviewText) {
    try {
        const response = await fetch(`https://your-api-url/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ review: reviewText })
        });
        handleResponse(response);
    } catch (error) {
        displayMessage('An error occurred. Please try again.');
        console.error('Error:', error);
    }
}

function handleResponse(response) {
    const messageElement = document.getElementById('message');
    if (response.ok) {
        messageElement.style.color = 'green';
        messageElement.textContent = 'Review submitted successfully!';
        document.getElementById('review-form').reset();
    } else {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Failed to submit review';
    }
}

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
}
