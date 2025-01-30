const TMDB_API_KEY = "bc40d10ccfb7ddd6ac30ad92986a8a89"; // Replace with your TMDB API Key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// ดึง movie_id และ mediaType จาก URL
function getParamsFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get("id"),
        type: params.get("type") // 'movie' หรือ 'tv'
    };
}

// ดึงข้อมูลรายละเอียด (Movie หรือ TV Show)
async function fetchDetails(id, type) {
    try {
        const endpoint = type === "tv" ? `/tv/${id}` : `/movie/${id}`;
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`);
        if (!response.ok) {
            console.error(`Failed to fetch ${type} details`);
            return null;
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching ${type} details:`, error);
        return null;
    }
}

// ดึงรายชื่อนักแสดง (Movie หรือ TV Show)
async function fetchCast(id, type) {
    try {
        const endpoint = type === "tv" ? `/tv/${id}/credits` : `/movie/${id}/credits`;
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            console.error(`Failed to fetch ${type} cast`);
            return null;
        }
        const data = await response.json();
        return data.cast.slice(0, 6); // แสดงนักแสดง 6 คนแรก
    } catch (error) {
        console.error(`Error fetching ${type} cast:`, error);
        return null;
    }
}

// ดึงข้อมูลตัวอย่างภาพยนตร์ (Movie หรือ TV Show)
async function fetchTrailer(id, type) {
    try {
        const endpoint = type === "tv" ? `/tv/${id}/videos` : `/movie/${id}/videos`;
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`);
        if (!response.ok) {
            console.error(`Failed to fetch ${type} trailer`);
            return null;
        }
        const data = await response.json();
        const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
        console.error(`Error fetching ${type} trailer:`, error);
        return null;
    }
}

// ฟังก์ชันโหลดข้อมูลภาพยนตร์และแสดงบนหน้าเว็บ
async function renderDetails() {
    const { id, type } = getParamsFromURL();
    if (!id || !type) {
        alert("Content ID or type is missing in the URL");
        return;
    }

    // ดึงข้อมูลรายละเอียด
    const details = await fetchDetails(id, type);
    if (!details) return;

    document.getElementById("movie-hero").style.backgroundImage = 
        `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${IMAGE_BASE_URL}${details.backdrop_path})`;
    document.getElementById("movie-poster").src = `${IMAGE_BASE_URL}${details.poster_path}`;
    document.getElementById("movie-title").innerText = details.title || details.name;
    document.getElementById("movie-genres").innerText = `Genres: ${details.genres.map((genre) => genre.name).join(", ")}`;
    document.getElementById("movie-release-date").innerText = `Release Date: ${details.release_date || details.first_air_date}`;
    document.getElementById("movie-overview").innerText = details.overview;

    // ดึงและแสดงรายชื่อนักแสดง
    const cast = await fetchCast(id, type);
    if (cast) {
        const castContainer = document.getElementById("movie-cast");
        castContainer.innerHTML = ""; // ✅ เคลียร์ข้อมูลเดิมก่อน
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

    // ดึงข้อมูลตัวอย่างหนัง (trailer)
    const trailerUrl = await fetchTrailer(id, type);
    if (trailerUrl) {
        const trailerButton = document.createElement("a");
        trailerButton.href = trailerUrl;
        trailerButton.target = "_blank";
        trailerButton.className = "btn btn-danger mt-3"; // ใช้ปุ่ม Bootstrap
        trailerButton.innerHTML = "🎬 Watch Trailer";

        // ใส่ปุ่มไว้ใต้ชื่อหนัง
        const movieDetails = document.getElementById("movie-details");
        if (movieDetails) {
            movieDetails.appendChild(trailerButton);
        } else {
            console.error("movie-details element not found");
        }
    }
}

// เริ่มการแสดงข้อมูล
document.addEventListener("DOMContentLoaded", renderDetails);
