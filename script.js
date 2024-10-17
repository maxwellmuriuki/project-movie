// API key and base URL for The Movie Database (TMDb)
const apiKey = '977acb2e425b19b5486c00e0fd925bfd';
const baseUrl = 'https://api.themoviedb.org/3';
const localApiUrl = 'http://localhost:3000/movies'; // Local API URL
let favorites = []; // Array to hold favorite movies

// Fetch popular movies (GET request)
function fetchMovies() {
    // Generate a random page number between 1 and 20 for variety
    const randomPage = Math.floor(Math.random() * 20) + 1;
    
    // Sending a GET request to fetch popular movies from a random page
    fetch(`${baseUrl}/movie/popular?api_key=${apiKey}&page=${randomPage}`)
        .then(response => response.json()) // Convert the response to JSON
        .then(data => displayMovies(data.results)) // Pass the movie data to displayMovies function
        .catch(error => console.error('Error fetching movies:', error)); // Catch any errors
}

// Fetch movies from local API (GET request)
function fetchLocalFavorites() {
    fetch(localApiUrl) // Fetch local favorite movies
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            favorites = data; // Store the fetched movies in the favorites array
            displayFavorites(); // Update the favorites list
        })
        .catch(error => console.error('Error fetching local favorites:', error)); // Catch any errors
}

// Display movies on the page
function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list'); // Get the movies list container
    moviesList.innerHTML = ''; // Clear the current movie list
    movies.forEach(movie => { // Iterate through each movie
        const movieCard = document.createElement('div'); // Create a new div for the movie card
        movieCard.className = 'movie-card'; // Set the class for styling
        movieCard.setAttribute('data-id', movie.id); // Set a data attribute for easy lookup
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}"> <!-- Movie poster -->
            <h3>${movie.title}</h3> <!-- Movie title -->
            <p>${movie.overview}</p> <!-- Movie description -->
            <p>Runtime: ${movie.runtime ? movie.runtime + ' minutes' : 'N/A'}</p> <!-- Movie runtime if available -->
            <button onclick="deleteMovie(${movie.id})">Delete Movie</button> <!-- Delete button -->
            <button onclick="addToFavorites(${movie.id}, '${movie.title}', '${movie.overview}', '${movie.poster_path}')">Add to Favorites</button> <!-- Pass poster_path to addToFavorites -->
        `;
        moviesList.appendChild(movieCard); // Append the movie card to the movies list
    });
}

// Search movies by title (GET request)
function searchMovies(query) {
    // Sending a GET request to search for movies based on the query
    fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`)
        .then(response => response.json()) // Convert the response to JSON
        .then(data => displayMovies(data.results)) // Pass the search results to displayMovies function
        .catch(error => console.error('Error searching movies:', error)); // Catch any errors
}

// Delete a movie from the displayed list
function deleteMovie(movieId) {
    const movieCard = document.querySelector(`.movie-card[data-id='${movieId}']`); // Find the card by data attribute
    if (movieCard) {
        movieCard.remove(); // Remove the movie card from the display
        alert('Movie deleted'); // Notify the user
    }
}

// Add a movie to favorites
function addToFavorites(movieId, title, overview, posterPath) {
    const movie = { id: movieId, title: title, overview: overview, poster_path: posterPath }; // Include poster_path
    favorites.push(movie); // Add it to the favorites array
    displayFavorites(); // Update the favorites list
    alert(`${title} has been added to favorites.`); // Notify the user
}

// Display favorite movies
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list'); // Get the favorites list container
    favoritesList.innerHTML = ''; // Clear the current favorites list
    favorites.forEach(favorite => { // Iterate through each favorite movie
        const favoriteCard = document.createElement('div'); // Create a new div for the favorite movie card
        favoriteCard.className = 'movie-card'; // Set the class for styling
        favoriteCard.setAttribute('data-id', favorite.id); // Set a data attribute for easy lookup
        favoriteCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${favorite.poster_path}" alt="${favorite.title}"> <!-- Favorite movie poster -->
            <h3>${favorite.title}</h3> <!-- Favorite movie title -->
            <p>${favorite.overview}</p> <!-- Favorite movie description -->
            <button onclick="removeFromFavorites(${favorite.id})">Remove from Favorites</button> <!-- Remove from favorites button -->
        `;
        favoritesList.appendChild(favoriteCard); // Append the favorite movie card to the favorites list
    });
}

// Remove a movie from favorites
function removeFromFavorites(movieId) {
    favorites = favorites.filter(favorite => favorite.id !== movieId); // Filter out the movie from favorites
    displayFavorites(); // Update the favorites list
}

// Event listeners
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-bar').value; // Get the search query
    searchMovies(query); // Call the searchMovies function
});

// Initial fetch to display popular movies and local favorites
fetchMovies(); // Call the fetchMovies function to display movies on page load
fetchLocalFavorites(); // Fetch and display local favorite movies on page load
