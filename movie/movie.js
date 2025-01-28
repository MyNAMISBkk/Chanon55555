const API_KEY = 'bc40d10ccfb7ddd6ac30ad92986a8a89';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;

// Fetch movies based on filters
async function fetchMovies() {
    const genres = document.getElementById('genres').value;
    const certification = document.getElementById('certification').value;
    const language = document.getElementById('language').value;
    const minVotes = document.getElementById('min-votes').value;
    const minRuntime = document.getElementById('min-runtime').value;
    const maxRuntime = document.getElementById('max-runtime').value;
    const userScore = document.getElementById('user-score').value;

    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}&with_genres=${genres}&certification=${certification}&with_original_language=${language}&vote_average.gte=${userScore}&vote_count.gte=${minVotes}&with_runtime.gte=${minRuntime}&with_runtime.lte=${maxRuntime}`;

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

// Event Listeners
document.getElementById('apply-filters').addEventListener('click', () => {
    currentPage = 1;
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

// Initial fetch
fetchMovies();
