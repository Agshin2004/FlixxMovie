const global = {
  activeSeason: 1,
  API_KEY: 'b165f62ffb2ff342ce7aea948e41336d',
  API_URL: 'https://api.themoviedb.org/3/',
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  }
};


function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

async function displayPopularMovies() {
  const { results: results } = await fetchAPIData('movie/popular'); // destructured results
  console.log(results);

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      ${movie.poster_path
        ?
        `<img
          src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
          class="card-img-top"
          alt="Movie Title"
        />` : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
      />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">${movie.release_date}</small>
      </p>
  </div>`;

    document.querySelector('#popular-movies').appendChild(div);

  })
}

// Display Popular TV shows
async function displayPopularShows() {
  const { results: results } = await fetchAPIData('tv/popular'); // destructured results
  console.log(results);

  results.forEach(show => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}?season=${activeSeason}">
      ${show.poster_path
        ?
        `<img
          src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
          class="card-img-top"
          alt="${show.name}"
        />` : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${show.name}"
      />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${show.first_air_date}</small>
      </p>
  </div>`;

    document.querySelector('#popular-shows').appendChild(div);

  })
}

// since we use fetchAPIData function here we need to make it async
async function displayMovieDetails() {
  const movieIdFromRoute = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieIdFromRoute}`); // get data of particular movie

  // Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
          <div>
            ${movie.poster_path ? `
              <img
                src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                class="card-img-top"
                alt="Movie Title"
              />` : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
    }
          </div>
          <div>
            <h2>${movie.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p> ${movie.overview} </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} Minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies: </h4>
          <div class="list-group">
            ${movie.production_companies.map(company => `<span>${company.name}</span>,   `).join('')}
          </div>
          <br>
          <h4>Production Countries: </h4>
          ${movie.production_countries.map(company => `<li>${company.name}</li>`).join('')}

        </div>

        <iframe type="video/WEBM" src="https://vidsrc.to/embed/movie/${movieIdFromRoute}" allowfullscreen="" width="850" height="550"> 
      `;

  document.querySelector('#movie-details').appendChild(div);

}

// Display show details
async function displayShowDetails() {
  console.log(window.location.search.split('=')[1]);
  const showIdFromRoute = window.location.search.split('=')[1].split('?')[0];
  console.log(showIdFromRoute);
  const show = await fetchAPIData(`tv/${showIdFromRoute}`); // get data of particular show
  
  const { seasons: seasons } = await fetchAPIData(`tv/${showIdFromRoute}`); // destructured results
  console.log(seasons[seasons.length - 1]);
  
  // Overlay for background image
  displayBackgroundImage('show', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div>
  <div class="details-top">
  <div class="details-top">
  ${show.poster_path ? `
    <img
      src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
      class="card-img-top"
      alt="Show Title"
    />` : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${show.title}"
  />`
    }
</div>

  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      8 / 10
    </p>
    <p class="text-muted">${show.first_air_date}</p>
    <p>${show.overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">${show.genres.map(genre => `<li>${genre.name}</li>`).join('')}</ul>
    <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
</div>
</div>

<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${addCommasToNumber(show.number_of_episodes)}</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${show.last_air_date}
    </li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${show.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}</div>
</div>

<label for="seasons">Choose season: </label> 
  <select name="seasons" id="choose-seasons" onchange="fireOn()">
  ${(() => {
    let options = '';
    for (let i = 1; i <= seasons[seasons.length - 1].season_number; i++) {
      options += `<option value="${i}">${i}</option>`;
    }
    return options;
  })()}
  </select>

<iframe type="video/WEBM" src="https://vidsrc.to/embed/tv/${showIdFromRoute}/112" allowfullscreen="" width="850" height="550"> 
`

  document.querySelector('#show-details').appendChild(div);
}

function fireOn() {
  const selectElement = document.getElementById('choose-seasons');
  const activeIndex = selectElement.selectedIndex;
  const activeValue = selectElement.options[activeIndex].value;
  console.log(activeValue);

  // history.pushState(activeValue, activeIndex+1);

  // history.go(activeValue);
}



function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Display dackdrop on details page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `https://image.tmdb.org/t/p/original/${backgroundPath}`;
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh'; // entire height
  overlayDiv.style.width = '100vw'; // entire weight
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.3';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// Fetch data from tmdbAPI; Whenever we need to get data from the api we'll call this function
// a pass the endpoint
async function fetchAPIData(endpoint) {
  const API_KEY = global.API_KEY;
  const API_URL = global.API_URL;

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

  const data = await response.json();
  hideSpinner();
  return data
}


// Make Request To Search; here we actually make request to the api
async function SearchAPIData() {
  showSpinner();

  const API_KEY = global.API_KEY;
  const API_URL = global.API_URL;

  showSpinner();

  const response = await fetch(`${API_URL}search/${global.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

  const data = await response.json();

  hideSpinner();

  return data;
}



// Search movies/shows; in search function we just grab the parameters
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString) // searches for params

  global.type = urlParams.get('type'); // got type from the url
  global.search.term = urlParams.get('search-term'); // got search term from the url

  if (global.search.term !== '' && global.search.term !== null) {
    const { results: results, currentPage: page, total_pages: totalPages, total_results: totalResults } = await SearchAPIData(); // take out total_pages and total_results for pagination

    console.log(results); // DELETE

    global.search.pageNum = page;
    global.search.totalPages = totalPages;
    global.search.totalResults = totalResults;

    // Checking if there are any results
    if (results.length === 0) {
      showAlert('No results found!', 'alert-error');
      return;
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = ''; // searched the input after request

  } else {
    showAlert('Search box is empty!', 'alert-error');
  }
}

async function displaySearchResults(results) {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="${global.type}-details.html?id=${result.id}">
      ${result.poster_path
        ?
        `<img
          src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
          class="card-img-top"
          alt="${global.type === 'movie' ? result.title : result.name}"
        />` : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${global.type === 'movie' ? result.title : result.name}"
      />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${global.type === 'movie' ? result.title : result.name}</h5>
      <p class="card-text">
        <small class="text-muted">${global.type === 'movie' ? result.release_date : result.first_air_date}</small>
      </p>
  </div>`;

    document.querySelector('#search-results-heading').innerHTML =
      `<h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`

    document.querySelector('#search-results').appendChild(div);

  })

  displayPagination();
}

// Create & display pagination for search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');

  div.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
          `
  document.querySelector('#pagination').appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true; // disabled the button
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true; // disabling the button
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, totalPages } = await SearchAPIData();
    displaySearchResults(results);
    document.documentElement.scrollTop = 0; // Scroll to top
  })

  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, totalPages } = await SearchAPIData();
    displaySearchResults(results);
    document.documentElement.scrollTop = 0; // Scroll to top

  })
}


// Show alert
function showAlert(message, className = 'alert-error') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));

  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000)
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Display now playing movies in the slider
async function displaySlider() {
  const { results: results } = await fetchAPIData('movie/now_playing')
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide')
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}
              "/>
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>`;
    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  })
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    }
  })
}

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('home');
      displayPopularMovies();
      displaySlider();
      break;
    case '/shows.html':
    case '/shows':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      console.log('search');
      break;
  }

  // Calling highlightActiveLink
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
