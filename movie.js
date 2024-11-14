const apiKey = "bcfbab1ae30d4b16aeacce6eacae5f67";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieGrid = document.getElementById("movieGrid");
const sortBy = document.getElementById("sortBy");
const favoritesBtn = document.getElementById("favoritesBtn");

const movieModal = document.getElementById("movieModal");
const favoritesModal = document.getElementById("favoritesModal");
const closeModalBtns = document.querySelectorAll(".close-btn");
const movieTitle = document.getElementById("movieTitle");
const moviePoster = document.getElementById("moviePoster");
const movieOverview = document.getElementById("movieOverview");
const movieReleaseDate = document.getElementById("movieReleaseDate");
const movieRating = document.getElementById("movieRating");
const movieRuntime = document.getElementById("movieRuntime");
const favoritesList = document.getElementById("favoritesList");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function fetchDefaultMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchMovieDetails(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    openMovieModal(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

function displayMovies(movies) {
  movieGrid.innerHTML = "";
  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : "https://via.placeholder.com/200x300?text=No+Image";
    const isFavorited = favorites.includes(movie.id);

    movieCard.innerHTML = `
      <img src="${poster}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Release: ${movie.release_date || "Unknown"}</p>
      <p>Rating: ${movie.vote_average || "N/A"}</p>
      <button onclick="fetchMovieDetails(${movie.id})">View Details</button>
      <button onclick="toggleFavorite(${movie.id})">
        ${isFavorited ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    `;
    movieGrid.appendChild(movieCard);
  });
}

function openMovieModal(movie) {
  movieTitle.textContent = movie.title;
  moviePoster.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Image";
  movieOverview.textContent = movie.overview || "No synopsis available.";
  movieReleaseDate.textContent = movie.release_date || "Unknown";
  movieRating.textContent = movie.vote_average || "N/A";
  movieRuntime.textContent = movie.runtime || "N/A";
  movieModal.classList.add("active");
}

function openFavoritesModal() {
  const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favoriteIds.length === 0) {
    favoritesList.innerHTML = "<p>No favorite movies added yet.</p>";
    favoritesModal.classList.add("active");
    return;
  }

  favoritesList.innerHTML = "";
  favoriteIds.forEach(async id => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
      );
      const movie = await response.json();

      const favoriteItem = document.createElement("div");
      favoriteItem.classList.add("favorite-item");
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
        : "https://via.placeholder.com/100x150?text=No+Image";

      favoriteItem.innerHTML = `
        <img src="${poster}" alt="${movie.title}">
        <h4>${movie.title}</h4>
        <p>Rating: ${movie.vote_average || "N/A"}</p>
      `;
      favoritesList.appendChild(favoriteItem);
    } catch (error) {
      console.error("Error fetching favorite movie details:", error);
    }
  });

  favoritesModal.classList.add("active");
}

closeModalBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    movieModal.classList.remove("active");
    favoritesModal.classList.remove("active");
  });
});

function toggleFavorite(movieId) {
  if (favorites.includes(movieId)) {
    favorites = favorites.filter(id => id !== movieId);
  } else {
    favorites.push(movieId);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  fetchDefaultMovies();
}

favoritesBtn.addEventListener("click", openFavoritesModal);

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query, sortBy.value);
  }
});

async function fetchMovies(query, sortOption = "popularity.desc") {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&sort_by=${sortOption}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

fetchDefaultMovies();
