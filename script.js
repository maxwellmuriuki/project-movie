document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const searchBar = document.getElementById("search-bar");
    const movieList = document.getElementById("movie-list");
    const TMDB_API_KEY = "977acb2e425b19b5486c00e0fd925bfd";

    // Function to fetch movies from the local db.json
    const fetchLocalMovies = async () => {
        try {
            const response = await fetch("http://localhost:3001/movies");
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error("Error fetching local movies:", error);
        }
    };

    // Function to search for movies using the TMDb API
    const searchExternalMovies = async () => {
        const query = searchBar.value.trim();
        if (!query) {
            alert("Please enter a movie title to search.");
            return;
        }

        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            displayExternalMovies(data.results);
        } catch (error) {
            console.error("Error fetching movies from TMDb:", error);
        }
    };

    // Function to display movies from the TMDb API on the page
    const displayExternalMovies = (movies) => {
        movieList.innerHTML = ""; // Clear previous movie listings
        movies.forEach(movie => {
            const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "placeholder.jpg";
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.innerHTML = `
                <img src="${posterPath}" alt="${movie.title} Poster" class="movie-poster">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-description">${movie.overview || "No description available."}</p>
                <button class="add-button" data-title="${movie.title}" data-description="${movie.overview}" data-poster="${posterPath}">Add to My List</button>
            `;
            movieList.appendChild(movieCard);
        });

        // Attach event listeners for add buttons
        document.querySelectorAll(".add-button").forEach(button => {
            button.addEventListener("click", (event) => {
                const title = event.target.getAttribute("data-title");
                const description = event.target.getAttribute("data-description");
                const poster = event.target.getAttribute("data-poster");
                addMovie({ title, description, poster });
            });
        });
    };

    // Function to display local movies from the db.json
    const displayMovies = (movies) => {
        movieList.innerHTML = ""; // Clear previous movie listings
        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title} Poster" class="movie-poster">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-description">${movie.description}</p>
                <button class="watch-button" data-id="${movie.id}">Watch Now</button>
                <button class="delete-button" data-id="${movie.id}">Delete</button>
            `;
            movieList.appendChild(movieCard);
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                deleteMovie(id);
            });
        });
    };

    // Function to add a new movie to the local db.json
    const addMovie = async (movie) => {
        try {
            const response = await fetch("http://localhost:3001/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movie),
            });
            if (response.ok) {
                fetchLocalMovies(); // Refresh the local movie list after adding
            } else {
                console.error("Error adding movie:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding movie:", error);
        }
    };

    // Function to delete a movie from the local db.json
    const deleteMovie = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/movies/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchLocalMovies(); // Refresh the movie list after deleting
            } else {
                console.error("Error deleting movie:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    // Event listener for the search button to fetch from the external API
    searchButton.addEventListener("click", searchExternalMovies);

    // Initial fetch to display all movies from the local db.json on page load
    fetchLocalMovies();
});
