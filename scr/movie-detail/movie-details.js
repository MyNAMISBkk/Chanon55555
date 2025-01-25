const TMDB_API_KEY = "bc40d10ccfb7ddd6ac30ad92986a8a89"; // Replace with your TMDB API Key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// ดึง movie_id จาก URL
function getMovieIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// ดึงข้อมูลภาพยนตร์จาก TMDB
async function fetchMovieDetails(movieId) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
    if (!response.ok) {
        console.error("Failed to fetch movie details");
        return null;
    }
    return response.json();
}

// ดึงรายชื่อนักแสดงจาก TMDB
async function fetchMovieCast(movieId) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
        console.error("Failed to fetch movie cast");
        return null;
    }
    const data = await response.json();
    return data.cast.slice(0, 6); // แสดงนักแสดง 6 คนแรก
}

// แสดงข้อมูลภาพยนตร์ในหน้า HTML
async function renderMovieDetails() {
    const movieId = getMovieIdFromURL();
    if (!movieId) {
        alert("Movie ID is missing in the URL");
        return;
    }

    // ดึงข้อมูลภาพยนตร์
    const movie = await fetchMovieDetails(movieId);
    if (!movie) return;

    document.getElementById("movie-hero").style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${IMAGE_BASE_URL}${movie.backdrop_path})`;
    document.getElementById("movie-poster").src = `${IMAGE_BASE_URL}${movie.poster_path}`;
    document.getElementById("movie-title").innerText = movie.title;
    document.getElementById("movie-genres").innerText = `Genres: ${movie.genres.map((genre) => genre.name).join(", ")}`;
    document.getElementById("movie-release-date").innerText = `Release Date: ${movie.release_date}`;
    document.getElementById("movie-overview").innerText = movie.overview;
    

    // ดึงและแสดงรายชื่อนักแสดง
    const cast = await fetchMovieCast(movieId);
    if (cast) {
        const castContainer = document.getElementById("movie-cast");
        cast.forEach((actor) => {
            const castCard = document.createElement("div");
            castCard.className = "col-md-4 mb-4";
            castCard.innerHTML = `
                <div class="card h-100">
                    <img src="${actor.profile_path ? IMAGE_BASE_URL + actor.profile_path : 'https://via.placeholder.com/300x450'}" class="card-img-top" alt="${actor.name}">
                    <div class="card-body">
                        <h5 class="card-title">${actor.name}</h5>
                        <p class="card-text">as ${actor.character}</p>
                    </div>
                </div>
            `;
            castContainer.appendChild(castCard);
        });
    }
}

// เริ่มการแสดงข้อมูล
document.addEventListener("DOMContentLoaded", renderMovieDetails);
