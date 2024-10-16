document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});

function fetchMovies() {
    fetch("http://localhost:3001/movies")  // Updated the URL to the correct endpoint
        .then(response => response.json())
        .then(movies => {
            displayMovies(movies);
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
        });
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML = ""; // Clear any existing content

    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");

        movieDiv.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-description">${movie.description}</p>
        `;

        moviesContainer.appendChild(movieDiv);
    });
}
