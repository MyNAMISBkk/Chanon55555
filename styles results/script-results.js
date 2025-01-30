const apiKey = 'bc40d10ccfb7ddd6ac30ad92986a8a89'; // Replace with your TMDB API key
const imageBaseUrl = 'https://image.tmdb.org/t/p/w300'; // Base URL for images

// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch and display search results
const searchQuery = getQueryParam('query');
if (searchQuery) {
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            const moviesList = document.getElementById('moviesList');
            if (data.results.length > 0) {
                data.results.forEach(item => {
                    const title = item.title || item.name;
                    const releaseDate = item.release_date || item.first_air_date;
                    const mediaType = item.media_type === 'movie' ? 'Movie' : 'TV Show';

                    const movieItem = document.createElement('div');
                    movieItem.classList.add('movie-item');
                    movieItem.innerHTML = `
                        <img src="${imageBaseUrl}${item.poster_path}" alt="${title} Poster" class="movie-poster">
                        <div class="movie-details">
                            <h3>${title}</h3>
                            <p>Type: ${mediaType}</p>
                            <p>Release Date: ${releaseDate}</p>
                            <p>User Score: ${item.vote_average} / 10</p>
                            <p>${item.overview}</p>

                        </div>
                    `;

                    movieItem.addEventListener('click', () => {
                        // ตรวจสอบว่า item.id มีค่า
                        if (item.id) {
                            // สร้าง URL พร้อม id และ type
                            window.location.href = `movie-details.html?id=${item.id}&type=${item.media_type}`;
                        } else {
                            console.error("Item ID is missing");
                        }
                    });
                    
                    
                    moviesList.appendChild(movieItem);

                    
                    

                    // Fetch cast information for each item
                    fetchCastInfo(item.id, item.media_type);
                });

                
            } else {
                moviesList.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data from TMDB:', error);
            moviesList.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
}

// Function to fetch cast information
function fetchCastInfo(itemId, mediaType) {
    const creditsUrl = mediaType === 'movie'
        ? `https://api.themoviedb.org/3/movie/${itemId}/credits?api_key=${apiKey}`
        : `https://api.themoviedb.org/3/tv/${itemId}/credits?api_key=${apiKey}`;

    fetch(creditsUrl)
        .then(response => response.json())
        .then(castData => {
            const castList = castData.cast.slice(0, 5).map(castMember => {
                const castImage = castMember.profile_path
                    ? `${imageBaseUrl}${castMember.profile_path}`
                    : 'path/to/default/image.jpg';
                return `
                    <div class="cast-member">
                        <img src="${castImage}" alt="${castMember.name}" class="cast-image">
                        <p>${castMember.name}</p>
                    </div>
                `;
            }).join('');
            document.getElementById(`cast-${itemId}`).innerHTML = `<p>Cast:</p><div class="cast-list">${castList}</div>`;
        })
        .catch(error => console.error('Error fetching cast data:', error));
}

