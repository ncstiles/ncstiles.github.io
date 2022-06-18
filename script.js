// import * as assert from 'assert'
const apiKey = 'a47267c9b249b769d20e9c89247afa61';
let moviesPerPage = 24;

let numLoads = 0;
let titles = [];
let imgPaths = [];
let ratings = [];
let overviews = [];
let ids = [];


//TODO:remember after the search field is cleared to clear these arrays to save space
let numSearchLoads = 0;
let searchTitles = [];
let searchImgPaths = [];
let searchRatings = [];
let searchOverviews = [];
let searchIds = [];

let textEntered = false;
let submitted = false;


/**
 * 
 * @returns an object literal containing the title, movie, rating and overview of recent movies
 */
async function getMovieData() {
    console.log('getting movie data');
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;

    const results = await getData(url);
    return results;
}

async function getSearchData(query) {
    console.log('getting search movie data');

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}`;

    const results = await getData(url);
    return results;

}

//TODO: change the loop back to numPages!  making it smaller for purposed of creating the website
//TODO: get the background info and the video content
/**
 *  Uses the now playing API to get recent movie data
 * @returns an object literal containing three arrays of recent movie data.
 *          Includes all the titles (array), movie poster url (array), and rating (array) data
 *          Info at elt `i` in any of these arrays corresponds to the same movie.
 */
async function getData(url) {
    console.log('getting data');
    const newTitles = [];
    const imgPathPiece = [];
    const newRatings = [];
    const newOverviews = [];
    const newIds = [];

    const response = await fetch(url);
    const mainPage = await response.json();

    const numPages = mainPage['total_pages'];
    const numMovies = mainPage['total_results'];
    // console.log('total pages:', numPages);
    // console.log(' total results:', numMovies);

    for (let i=1; i<= numPages; i++) {

        const pageUrl = url + `&page=${i}`;

        let response = await fetch(pageUrl);
        let data = await response.json();
        // console.log(data);
        const movies = data['results'];


        for (let movie of movies) {
            // API has bug st some images don't render properly.  Don't include these in results for aesthetic purposes
            if (movie['poster_path']) { 
                newTitles.push(movie['title']);
                imgPathPiece.push(movie['poster_path']);  
                newRatings.push(movie['vote_average']);   
                newOverviews.push(movie['overview']);
                newIds.push(movie['id']);
                console.log('pushing a movie');
            } 
        }
    }

    console.log('length of non-null image results', newTitles.length);
    // console.log('number of results matches:', titles.length === numMovies);
    return { newTitles, imgPathPiece, newRatings, newOverviews, newIds }; 

}

/**
 * Uses the config API to get base url and potential poster sizes
 * @returns a `baseURL` (string) and an array `posterSize` of different postersizes
 */
async function imageSetup(){
    url = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    // console.log('images', data['images']);
    // console.log('baseurl', data['images']['base_url']);
    // console.log('postersize', data['images']['poster_sizes']);

    const baseUrl = data['images']['base_url'];
    const possiblePosterSizes = data['images']['poster_sizes'];

    return { baseUrl, possiblePosterSizes };
}

/**
 * 
 * @param {string} base the base URL from the confi api
 * @param {string} possiblePosterSizes all possible poster sizes
 * @param {string} specificPaths an array of strings representing the specific path to a movie poster
 * @returns an array of strings, where each element concatenates base, size, and the specific path
 */
function genImgPath(base, possiblePosterSizes, specificPaths) {
    const middleIx = Math.round(possiblePosterSizes.length/ 2);
    const posterSize = possiblePosterSizes[middleIx - 1];

    const fullPaths = [];
    for (let specificPath of specificPaths) {
        let newPath = base + posterSize + specificPath;
        fullPaths.push(newPath);
    }
    return fullPaths;
}

async function loadPage() {
    const containerId = 'movies-grid';
    await displayPage(numLoads, imgPaths, titles, ratings, overviews, ids, containerId);

    numLoads += 1;
    console.log('current normal mode page number', numLoads-1);

    if (numLoads * moviesPerPage >= titles.length) { //If there are no more elements to show past this page hide "load more" button
        console.log('trying to hide the movies button', 'titles length', titles.length);
        load-more-movies-btn.classList.add('disabled'); //choosing hidden to not shift the movie imgs up
    }
}

async function loadSearchPage() {
    console.log('within loadsearchpage');
    const containerId = 'allSearchMovies';
    console.log('search titles length:', searchTitles.length);
    await displayPage(numSearchLoads, searchImgPaths, searchTitles, searchRatings, searchOverviews, searchIds, containerId);

    numSearchLoads += 1;
    console.log('current search page number:', numSearchLoads);

        
    if (numSearchLoads * moviesPerPage >= searchTitles.length) { //If there are no more elements to show past this page hide "load more" button
        console.log('trying to hide the search button', 'searchtitles length', searchTitles.length);
        // searchButton.style.visibility = 'hidden';  //choosing hidden to not shift the movie imgs up
        searchButton.classList.add('disabled'); //choosing hidden to not shift the movie imgs up
s
    }
}


/**
 * Given the page number and under the assumption that each page contains 24 movies, appends the 24 movies information to the website
 */
async function displayPage(pageIx, imgArr, titlesArr, ratingsArr, overviewsArr, idsArr, mainContainer) {
    // TODO: assert(imgPaths.length === titles.length === ratings.length);
    console.log('\n');
    console.log('pageIx:', pageIx);
    const startingIx = pageIx*moviesPerPage;
    const endingIx = (pageIx+1)*moviesPerPage;
    const pageImgPaths = imgArr.slice(startingIx, Math.min(imgArr.length, endingIx));
    const pageTitles = titlesArr.slice(startingIx, Math.min(titlesArr.length, endingIx));
    const pageRatings = ratingsArr.slice(startingIx, Math.min(ratingsArr.length, endingIx));
    const pageOverviews = overviewsArr.slice(startingIx, Math.min(overviewsArr.length, endingIx));
    const pageIds = idsArr.slice(startingIx, Math.min(overviewsArr.length, endingIx));
    console.log('page Ix', pageIx)
    console.log('starting and ending index:', startingIx, endingIx);
    let zip = (a, b, c, d, e) => a.map((elt,i) => [elt, b[i], c[i], d[i], e[i]]);

    
    const trailerCard = document.getElementById('trailerCard');


    for (let [imgPath, title, rating, overview, id] of zip(pageImgPaths, pageTitles, pageRatings, pageOverviews, pageIds)) {
        const singleMovieDiv = document.createElement('div');
        singleMovieDiv.className = 'movie-card';

        // create wrapper to contain the image and the overview
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'imgWrapper';

        const img = document.createElement("img");
        img.src = imgPath;
        img.alt = 'movie poster';
        img.classList.add('movie-poster', 'blur');
        imgWrapper.appendChild(img);

        const overviewTag = document.createElement("h5")
        const overviewText = document.createTextNode(overview);
        overviewTag.appendChild(overviewText);
        overviewTag.classList.add('overview', 'fade');
        imgWrapper.appendChild(overviewTag);


        // create wrapper to contain the title and the rating
        const infoWrapper = document.createElement('div');
        infoWrapper.className = 'movieInfo';

        //add title to infoWrapper
        const titleTag = document.createElement("h5");
        const titleText = document.createTextNode(title);
        titleTag.appendChild(titleText);
        titleTag.className = 'movie-title';
        infoWrapper.appendChild(titleTag);

        // add rating to infoWrapper
        const ratingTag = document.createElement("h5")
        const ratingText = document.createTextNode('⭐ ' + rating);
        ratingTag.appendChild(ratingText);
        ratingTag.className = 'movie-votes';
        infoWrapper.appendChild(ratingTag);

        const videoLink = await getYoutubeHTML(id);

        singleMovieDiv.addEventListener("click", () => {
            console.log('clicked');

            //add video
            const videoTag = document.createElement("iframe");
            videoTag.className = 'embeddedVideo';
            console.log('video link:', videoLink);
            videoTag.src = videoLink;
            console.log('videotag created');

            //add popup close button
            const videoButton = document.createElement('button');
            videoButton.innerHTML = 'Close trailer';
            videoButton.classList.add('popupButton');

            videoButton.addEventListener('click', () =>{
                trailerCard.innerHTML = '';
                trailerCard.style.display = 'none';
            })

            trailerCard.innerHTML = '';
            trailerCard.append(videoTag);
            trailerCard.append(videoButton);

            trailerCard.style.display = 'block';


        });
        const div = document.getElementById(mainContainer);

        singleMovieDiv.appendChild(imgWrapper); 
        singleMovieDiv.appendChild(infoWrapper);// add title + rating to DOM
        div.appendChild(singleMovieDiv);

    }

}


async function getYoutubeHTML(movieId) {
    url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    
    const response = await fetch(url);
    const data = await response.json();
    // console.log('data results;', data['results']);
    if (data['results'] && data['results'].length > 0) {
        for (let potentialVid of data['results']) {
            // console.log('potentialVidData', potentialVid);
            if (potentialVid['type'] === 'Trailer') {
                console.log('link:',`https://www.youtube.com/embed/${potentialVid['key']}` );
                return `https://www.youtube.com/embed/${potentialVid['key']}`;
            }
        }
        console.log('not trailer found');
    } 
    else {
        console.log('no videos associated with this url');
        // return 'no images associated with this url';
    }
    
}
/**
 * Make an API call using the searched term and display the new movies that match
//  * @param {*} event search event
 */
async function search() {
    console.log('\n');
    clearSearchInfo();
    document.getElementById("movies-grid").style.display = "none";
    document.getElementById("movieButtonDiv").style.display = "none";

    document.getElementById("allSearchMovies").style.display = "grid";
    document.getElementById("searchButtonDiv").style.display = "grid";

    submitted = true;
    event.preventDefault();
    const searchedVal = searchBarElt.value;
    let { newTitles, imgPathPiece, newRatings, newOverviews, newIds } = await getSearchData(searchedVal);
    searchTitles = newTitles;
    searchRatings = newRatings;
    searchOverviews = newOverviews;
    searchIds = newIds;


    let {baseUrl, possiblePosterSizes } = await imageSetup();

    
    const fullPaths = genImgPath(baseUrl, possiblePosterSizes, imgPathPiece);
    searchImgPaths = fullPaths;
    searchedSmth = false;
    numSearchLoads = 0;
    await loadSearchPage();
}

function clearSearchInfo() {
    document.getElementById("allSearchMovies").innerHTML= '';
    searchTitles = [];
    searchImgPaths = [];
    searchRatings = [];
    searchOverviews = [];
    numSearchLoads = 0;
    searchedSmth = false;

    console.log('search info cleared!');

}

function closeSearch() {
    console.log('close search hit!')
    clearSearchInfo();
    document.getElementById("allSearchMovies").style.display = "none";
    document.getElementById("searchButtonDiv").style.display = "none";

    document.getElementById("movies-grid").style.display = "grid";
    document.getElementById("movieButtonDiv").style.display = "grid";
    document.getElementById('search-input').value = '';
}

function scrollButtonDisplay() {
    console.log('button clicked;'); 
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollButton.style.display = "grid";
      } else {
        scrollButton.style.display = "none";
      }
}

// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
    // document.body.scrollTop = 0;
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

function forClearButton() {
    console.log('for clear button');
    closeSearch();
    console.log('after close search clear button');

}

async function main() {
    console.log('in main');
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

window.onload = () => {
    document.getElementById("allSearchMovies").style.display = "none";
    document.getElementById('searchButtonDiv').style.display = 'none';
    main();
}

const searchBarElt = document.getElementById('search-input');

const movieButton = document.getElementById('load-more-movies-btn');
const searchButton = document.getElementById('searchButton');
const scrollButton = document.getElementById('scrollButton');
const clearButton  = document.getElementById('clearButton');

document.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        search();
    }
});


searchBarElt.addEventListener('input', (event) => {
    const value = searchBarElt.value;
    console.log('form elt value:', value);
    if (value) {
        textEntered = true;
    }

    if (textEntered && submitted) {
        console.log('something has been searched and has already been submitted');
        console.log('current text:', value);

        if(!value) {
            console.log('there is no value left!  about to hit closesearch');
            closeSearch();
            console.log('after close search no more input text');
        }
    }
});

scrollButton.addEventListener('click', scrollToTop);







