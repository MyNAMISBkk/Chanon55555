const apiKey = 'bc40d10ccfb7ddd6ac30ad92986a8a89'; // Replace with your TMDB API key
const imageBaseUrl = 'https://image.tmdb.org/t/p/w300'; // Base URL for images

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }; // เช่น Jan 23, 2025
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}



function fetchTrendingData() {
    const trendingTodayUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;

    fetch(trendingTodayUrl)
        .then(response => response.json())
        .then(data => {
            const trendingTodayList = document.querySelector('.trending-today .trending-list');
            data.results.forEach(item => {
                const title = item.title || item.name; // ใช้ title สำหรับ Movies และ name สำหรับ TV Shows
                const trendingItem = document.createElement('div');
                const releaseDate = item.release_date || item.first_air_date;
                const formattedDate = releaseDate ? formatDate(releaseDate) : 'N/A';
                trendingItem.classList.add('trending-item');
                trendingItem.setAttribute('data-title', title); // เพิ่ม data attribute สำหรับชื่อเรื่อง
                trendingItem.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${title} Poster" class="movie-poster">
                    <h3>${title}</h3>
                    <p>${formattedDate}</p>
                `;
                trendingTodayList.appendChild(trendingItem);

                // เพิ่ม Event Listener สำหรับคลิกที่แต่ละรายการ
                trendingItem.addEventListener('click', () => {
                    window.location.href = `search-results.html?query=${encodeURIComponent(title)}`;
                });
            });
        })
        .catch(error => console.error('Error fetching trending data:', error));
}



// Select all trending items
const trendingItems = document.querySelectorAll('.trending-item');

// Loop through each trending item
trendingItems.forEach(item => {
    // Find the image inside the trending item
    const image = item.querySelector('img');

    // Add a click event listener to the image
    image.addEventListener('click', () => {
        // Fetch the movie details when the image is clicked
        const movieId = item.getAttribute('data-id'); // Assuming you have a data-id attribute on the trending item
        fetchMovieDetails(movieId);
    });
});

// Function to fetch movie details
function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display the movie details in the trending section
            displayMovieDetails(data);
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Call the function to fetch trending data
fetchTrendingData();



document.addEventListener('DOMContentLoaded', function () {
    const searchQuery = getQueryParam('query');
    if (searchQuery) {
        document.getElementById('searchInput').value = searchQuery;
        document.getElementById('searchButton').click();
    }
});



document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value;
    if (searchInput.trim() !== '') {
        // Redirect to the new page with the search query as a URL parameter
        window.location.href = `search-results.html?query=${encodeURIComponent(searchInput)}`;
    }

    const moviesList = document.getElementById('moviesList');
    const videoContainer = document.getElementById('videoContainer');
    const recommendationsList = document.getElementById('recommendationsList');
    const videosList = document.getElementById('videosList'); // New section for videos




    // Clear previous results
    moviesList.innerHTML = '';
    videoContainer.innerHTML = '';


    
    // Fetch movie data from TMDB
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                data.results.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.classList.add('movie-item');
                    movieItem.innerHTML = `
                    <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title} Poster" class="movie-poster">
                    <div class="movie-details">
                        <h3>${movie.title}</h3>
                        <p>Release Date: ${movie.release_date}</p>
                        <p>User  Score: ${movie.vote_average} / 10</p>
                        <p>${movie.overview}</p>
                        <button class="play-button" data-id="${movie.id}">Play Trailer</button>
                        <div class="cast-info" id="cast-${movie.id}"></div>
                    </div>
                `;
                    moviesList.appendChild(movieItem);

                    // Fetch cast information for each movie
                    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`)
                        .then(response => response.json())
                        .then(castData => {
                            const castList = castData.cast.slice(0, 5).map(castMember => {
                                const castImage = castMember.profile_path ? `${imageBaseUrl}${castMember.profile_path}` : 'path/to/default/image.jpg'; // Default image if no profile picture
                                return `
                                    <div class="cast-member">
                                        <img src="${castImage}" alt="${castMember.name}" class="cast-image">
                                        <p>${castMember.name}</p>
                                    </div>
                                `;
                            }).join('');
                            document.getElementById(`cast-${movie.id}`).innerHTML = `<p>Cast:</p><div class="cast-list">${castList}</div>`;
                        });
                });

                function fetchVideos(movieId) {
    const videosList = document.getElementById('videosList');

    // Fetch video data from TMDB
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                data.results.forEach(video => {
                    const videoItem = document.createElement('div');
                    videoItem.classList.add('video-item');
                    videoItem.innerHTML = `
                        <h4>${video.name} (${video.type})</h4>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `;
                    videosList.appendChild(videoItem);
                });
            } else {
                videosList.innerHTML = '<p>No videos available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching video data from TMDB:', error);
            videosList.innerHTML = '<p>Error fetching videos. Please try again later.</p>';
        });
}

                // Add event listeners to play buttons
                const playButtons = document.querySelectorAll('.play-button');
                playButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const movieId = this.getAttribute('data-id');
                        playTrailer(movieId);
                    });
                });
            } else {
                moviesList.innerHTML = '<p>No movies found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data from TMDB:', error);
            moviesList.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
});

// Function to play trailer
function playTrailer(movieId) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = ''; // Clear previous video

    // Fetch video data from TMDB
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const videoId = data.results[0].key; // Get the first video
                const iframe = document.createElement('iframe');
                iframe.width = '560';
                iframe.height = '315';
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`; // Auto-play and mute
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                videoContainer.appendChild(iframe);
            } else {
                videoContainer.innerHTML = '<p>No trailer available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching video data from TMDB:', error);
            videoContainer.innerHTML = '<p>Error fetching video. Please try again later.</p>';
        });
}






const backgroundMusic = document.getElementById('backgroundMusic');
const toggleMusicButton = document.getElementById('toggleMusicButton');

toggleMusicButton.addEventListener('click', function() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        toggleMusicButton.textContent = 'Pause Music';
    } else {
        backgroundMusic.pause();
        toggleMusicButton.textContent = 'Play Music';
    }

    const trendingList = document.querySelector('.trending-list');

    let isDown = false;
    let startX;
    let scrollLeft;
    
    trendingList.addEventListener('mousedown', (e) => {
        isDown = true;
        trendingList.classList.add('active');
        startX = e.pageX - trendingList.offsetLeft;
        scrollLeft = trendingList.scrollLeft;
    });
    
    trendingList.addEventListener('mouseleave', () => {
        isDown = false;
        trendingList.classList.remove('active');
    });
    
    trendingList.addEventListener('mouseup', () => {
        isDown = false;
        trendingList.classList.remove('active');
    });
    
    trendingList.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - trendingList.offsetLeft;
        const walk = (x - startX) * 3; // ความเร็วของการเลื่อน
        trendingList.scrollLeft = scrollLeft - walk;
    });
    


});
