const API_KEY = 'bc40d10ccfb7ddd6ac30ad92986a8a89';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;

// Fetch movies based on filters
async function fetchMovies() {
    const genres = document.getElementById('genres').value;
    const year = document.getElementById('release-year').value;
    const userScore = document.getElementById('user-score').value;
    const certification = document.getElementById('certification').value;

    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}`;
    
    if (genres) url += `&with_genres=${genres}`;
    if (year) url += `&primary_release_year=${year}`;
    if (userScore > 0) url += `&vote_average.gte=${userScore}`;
    if (certification) url += `&certification_country=US&certification=${certification}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies-container');
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="details">
                <h3>${movie.title}</h3>
                <p>Release: ${movie.release_date}</p>
                <p>Rating: ⭐ ${movie.vote_average} / 10</p>
            </div>
        `;
        movieCard.addEventListener('click', () => {
                // ตรวจสอบว่า item.id มีค่า
                if (movie.id) {
                    // สร้าง URL พร้อม id และ type
                    window.location.href = `movie-details.html?id=${movie.id}&type=${movie.media_type}`;
                } else {
                    console.error("Item ID is missing");
                }
            });
            
        
        moviesContainer.appendChild(movieCard);
    });
}

// Event Listeners for filters
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for year select
    document.getElementById('release-year').addEventListener('change', () => {
        currentPage = 1;
        fetchMovies();
    });

    // Event listener for genres select
    document.getElementById('genres').addEventListener('change', () => {
        currentPage = 1;
        fetchMovies();
    });

    // Event listener for certification select
    document.getElementById('certification').addEventListener('change', () => {
        currentPage = 1;
        fetchMovies();
    });

    // Event listener for user score range
    const userScore = document.getElementById('user-score');
    const scoreValue = document.getElementById('score-value');
    
    userScore.addEventListener('input', function() {
        scoreValue.textContent = this.value;
    });

    userScore.addEventListener('change', () => {
        currentPage = 1;
        fetchMovies();
    });

    // Initial fetch
    fetchMovies();
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchMovies();
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    fetchMovies();
});
