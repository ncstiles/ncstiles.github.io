const apiKey = 'a47267c9b249b769d20e9c89247afa61';
const zip = (a, b, c, d, e) => a.map((elt,i) => [elt, b[i], c[i], d[i], e[i]]); // to mimic python zip functionality
const moviesPerPage = 24;

//for top results 
let pageNum = 0;
let titles = [];
let imgPaths = [];
let ratings = [];
let overviews = [];
let ids = [];

//for searched results
let searchPageNum = 0;
let searchTitles = [];
let searchImgPaths = [];
let searchRatings = [];
let searchOverviews = [];
let searchIds = [];

const movieButton = document.getElementById('load-more-movies-btn');
const searchButton = document.getElementById('searchButton');
const scrollButton = document.getElementById('scrollButton');
const clearButton  = document.getElementById('clearButton');
const trailerButton = document.getElementById('trailerButton');

const trailerPopup = document.getElementById('trailerPopup');
const trailer = document.getElementById('trailer');

//two main container divs
const movieGridId = 'movies-grid';
const searchMovieGridId = 'searchResults-grid';
const topResultsDiv = document.getElementById(movieGridId);
const searchResultsDiv = document.getElementById(searchMovieGridId);

//associated with search functionality
const searchBarElt = document.getElementById('search-input');
const searchInput = document.getElementById('search-input');
let textEntered = false;

/**
 * Get movie data linked to new movies in theaters
 * 
 * @returns an object literal containing the title, poster url, rating, overview, and trailer of id of recent movies
 */
async function getMovieData() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
    const results = await getData(url);
    return results;
}

/**
 * Get movie data linked to search query
 * 
 * @param {string} query the searched term
 * @returns an object literal containing the title, poster url, rating, overview, and trailer of id of all movies associated with `query`
 */
async function getSearchData(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}`;
    const results = await getData(url);
    return results;
}

/**
 *  Uses TMBD API to get movie data
 * 
 * @param {string} url API url
 * @returns an object literal containing the title, poster url, rating, overview, and trailer of id of all movies at `url`
 */
async function getData(url) {
    const newTitles = [];
    const imgPathPiece = [];
    const newRatings = [];
    const newOverviews = [];
    const newIds = [];

    const response = await fetch(url);
    const mainPage = await response.json();

    const numPages = mainPage['total_pages'];
    const numMovies = mainPage['total_results']; //TODO: add text saying <someNum> of <numMoves> results displayed

    //TODO: once loading icon implemented iterate through all results: i <= `numPages`
    for (let i=1; i <= 10; i++) { //setting max pages to 10 for quicker loading
        const pageUrl = url + `&page=${i}`;

        const response = await fetch(pageUrl);
        const data = await response.json();

        for (let movie of data['results']) {
            // API has bug such that some images don't render properly.  Don't include these in results for aesthetic purposes
            if (movie['poster_path']) { 
                newTitles.push(movie['title']);
                imgPathPiece.push(movie['poster_path']);  
                newRatings.push(movie['vote_average']);   
                newOverviews.push(movie['overview']);
                newIds.push(movie['id']);
            } 
        }
    }
    return { newTitles, imgPathPiece, newRatings, newOverviews, newIds }; 
}

/**
 * Uses the config API to get base url for retrieving movie posters, along with potential poster sizes
 * 
 * @returns `baseURL` (string) and `posterSize` (array) of different postersizes
 */
async function imageSetup(){
    const url = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    const baseUrl = data['images']['base_url'];
    const possiblePosterSizes = data['images']['poster_sizes'];

    return { baseUrl, possiblePosterSizes };
}

/**
 * Generate url for a specific movie poster and movie poster size
 * 
 * @param {string} base the base URL from the confi api
 * @param {Array} possiblePosterSizes all possible poster sizes
 * @param {Array} specificPaths an array of strings representing the specific path to a movie poster
 * @returns an array of strings, where each arr elt is a url to a movie poster at a specific size
 */
function genImgPath(base, possiblePosterSizes, specificPaths) {
    const middleIx = Math.round(possiblePosterSizes.length/ 2);
    const posterSize = possiblePosterSizes[middleIx - 1]; // arbitrary decision, just looked best given screen size

    const fullPaths = [];
    for (let specificPath of specificPaths) {
        const newPath = base + posterSize + specificPath;
        fullPaths.push(newPath);
    }
    return fullPaths;
}

/**
 * Display current set of the new movies to theaters
 */
async function loadPage() {
    await displayPage(pageNum, imgPaths, titles, ratings, overviews, ids, movieGridId);
    pageNum += 1;

    if (pageNum * moviesPerPage >= titles.length) { //If there are no more elements to show past this page hide "load more" button
        load-more-movies-btn.classList.add('disabled'); 
    }
}

/**
 * Display current set of searched movies
 */
async function loadSearchPage() {
    await displayPage(searchPageNum, searchImgPaths, searchTitles, searchRatings, searchOverviews, searchIds, searchMovieGridId);
    searchPageNum += 1;

    if (searchPageNum * moviesPerPage >= searchTitles.length) { //If there are no more elements to show past this page hide "load more" button
        searchButton.classList.add('disabled');
    }
}


/**
 * Given a page number, display all movies that belong on that page
 * 
 * @param {number} pageIx number of times more movie results have been displayed
 * @param {Array} imgArr each string elt is url to movie poster
 * @param {Array} titlesArr each string elt is a movie title
 * @param {Array} ratingsArr each string elt is a movie rating
 * @param {Array} overviewsArr each string elt is a movie overview
 * @param {Array} idsArr each string elt is a movie's trailer video id
 * @param {string} mainContainer id of either the recent movie container div or the search movie container div
 */
async function displayPage(pageIx, imgArr, titlesArr, ratingsArr, overviewsArr, idsArr, mainContainer) {
    const startingIx = pageIx * moviesPerPage;
    const endingIx = (pageIx+1) * moviesPerPage;

    /* get info corresponding to which "page" of results to display */
    const pageImgPaths = imgArr.slice(startingIx, Math.min(imgArr.length, endingIx));
    const pageTitles = titlesArr.slice(startingIx, Math.min(titlesArr.length, endingIx));
    const pageRatings = ratingsArr.slice(startingIx, Math.min(ratingsArr.length, endingIx));
    const pageOverviews = overviewsArr.slice(startingIx, Math.min(overviewsArr.length, endingIx));
    const pageIds = idsArr.slice(startingIx, Math.min(overviewsArr.length, endingIx));

    const allMovieDiv = document.getElementById(mainContainer);

    /* go through each movie and render! */
    for (let [imgPath, title, rating, overview, id] of zip(pageImgPaths, pageTitles, pageRatings, pageOverviews, pageIds)) {
        
        //create div to contain movie's image, title, rating, overview, and trailer
        const singleMovieDiv = document.createElement('div');
        singleMovieDiv.className = 'movie-card';
        
        // create div to contain the movie's image poster and the overview
        const imgWrapper = document.createElement('div'); 
        imgWrapper.className = 'imgWrapper';

        // create div to contain the movie's title and rating
        const infoWrapper = document.createElement('div'); 
        infoWrapper.className = 'movieInfo';

        // create img element and add to imgWrapper
        const img = document.createElement("img");
        img.src = imgPath;
        img.alt = 'movie poster';
        img.classList.add('movie-poster', 'blur');
        imgWrapper.appendChild(img);

        // create overview element and add to imgWrapper
        addTextTag(overview, ['overview', 'fade'], imgWrapper);

        //create title element and add to infoWrapper
        addTextTag(title, ['movie-title'], infoWrapper)

        // add rating element and add to infoWrapper
        addTextTag('⭐ ' + rating, ['movie-votes'], infoWrapper)

        //get youtube trailer url associated with this movie
        const videoLink = await getYoutubeHTML(id);

        // if we click on movie card, display the trailer
        singleMovieDiv.addEventListener("click", () => {
            trailer.src = videoLink;

            trailerPopup.addEventListener('click', clearTrailerPopup);
            trailerButton.addEventListener('click', clearTrailerPopup);
            trailerPopup.style.display = 'block';
        });
        singleMovieDiv.appendChild(imgWrapper); 
        singleMovieDiv.appendChild(infoWrapper);
        allMovieDiv.appendChild(singleMovieDiv);
    }
}

/**
 * Create a new HTML header element with contents `text` and classnames `identifiers` and add it to its parent HTML element
 * 
 * @param {string} text the contents of this new element
 * @param {Array} identifiers classes to style this new element with
 * @param {HTMLDivElement} wrapperDiv the parent div to add this new element to
 */
function addTextTag(text, identifiers, wrapperDiv) {
    const tag = document.createElement("h5")
    const tagText = document.createTextNode(text);
    tag.appendChild(tagText);
    identifiers.forEach(identifier => tag.classList.add(identifier));
    wrapperDiv.appendChild(tag);
}

/**
 * Hide the trailer div and clear the trailer iframe's contents
 */
function clearTrailerPopup() {
    trailerPopup.style.display = 'none';
    trailer.src = 'about:blank';
}

/**
 * Retrieve the Youtube URL of this movie's trailer
 * @param {*} movieId the id of the movie's video contents
 * @returns the Youtube url of this movie
 */
async function getYoutubeHTML(movieId) {
    url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    
    const response = await fetch(url);
    const data = await response.json();
    const videos = data['results'];

    if (videos) {
        for (let video of videos) {
            if (video['type'] === 'Trailer') {
                return `https://www.youtube.com/embed/${video['key']}`;
            }
        }
        //TODO: if we reach here no trailer exists.  Either alert user or display alternate video
    } 
    else {
        // TODO: No videos associated with this movie.  Alert user or not show this movie card.
    } 
}

/**
 * Make an API call using the searched term, then display the new movies that match
 *
 * @param {string} searchedText string in search bar upon entering/ submitting
 */
async function search(searchedText) {
    //clear previous results and reset div contents
    clearSearchInfo(); 

    topResultsDiv.style.display = "none";
    movieButton.style.display = "none";

    searchResultsDiv.style.display = "grid";
    searchButton.style.display = "grid";

    searchPageNum = 0;

    //generate new data from the search
    let { newTitles, imgPathPiece, newRatings, newOverviews, newIds } = await getSearchData(searchedText);
    
    searchTitles = newTitles;
    searchRatings = newRatings;
    searchOverviews = newOverviews;
    searchIds = newIds;

    let {baseUrl, possiblePosterSizes } = await imageSetup();
    const fullPaths = genImgPath(baseUrl, possiblePosterSizes, imgPathPiece);
    searchImgPaths = fullPaths;

    await loadSearchPage();
}

/**
 * Clear search div's HTML and arrays that hold search contents
 */
function clearSearchInfo() {
    searchResultsDiv.innerHTML= '';
    searchTitles = [];
    searchImgPaths = [];
    searchRatings = [];
    searchOverviews = [];
    searchPageNum = 0;
}

/**
 * Clear and hide search div and re-display the regular top movies div
 */
function closeSearch() {
    clearSearchInfo();
    searchBarElt.value = '';

    searchResultsDiv.style.display = "none";
    searchButton.style.display = "none";
    topResultsDiv.style.display = "grid";
    movieButton.style.display = 'grid';
}

/**
 * Get all new movies, store their contents, and display the movies
 */
async function showRecents() {
    let { newTitles, imgPathPiece, newRatings, newOverviews, newIds } = await getMovieData();
    titles = newTitles;
    ratings = newRatings;
    overviews = newOverviews;
    ids = newIds;

    let {baseUrl, possiblePosterSizes } = await imageSetup();
    const fullPaths = genImgPath(baseUrl, possiblePosterSizes, imgPathPiece);
    imgPaths = fullPaths;
    await loadPage();
}

// search for movies based on input, and return to default new movies display when input field cleared
searchInput.addEventListener("keyup", (event) => {
    const searchedText = searchBarElt.value;

    if (event.key === 'Enter') {
        search(searchedText);
    }

    if (!searchedText) {
        closeSearch();
    }
});

// scroll to top of page
scrollButton.addEventListener('click', () => {
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

window.onload = () => {
    searchResultsDiv.style.display = "none";
    searchButton.style.display = "none";
    trailerPopup.style.display = "none";
    showRecents();
}








