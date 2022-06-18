## Week 1 Assignment: Flixster

Submitted by: Nicole Stiles

Estimated time spent: 24hrs

Deployed Application: [Flixster Deployed Site](https://ncstiles.github.io/)

### Application Features

#### CORE FEATURES

- [x] User can view a list of current movies from The Movie Database API as a grid view
  - [x] The grid element should have an id of `movies-grid`
  - [x] Each movie wrapper element should have a class of `movie-card`
- [x] For each movie displayed, user can see the following details:
  - [x] Title - the element should have a class of `movie-title`
  - [x] Image - the `img` element should have a class of `movie-poster`
  - [x] Votes - the element should have a class of `movie-votes`
- [x] User can load more current movies by clicking a button at the bottom of the list
  - [x] The button should have an id of `load-more-movies-btn`.
  - [x] When clicked, the page should not refresh.
  - [x] New movies should simply be added to the bottom
- [x] Allow users to search for movies and display them in a grid view
  - [x] There should be a search input element with an id of `search-input`
  - [x] Users should be able to type into the input
  - [x] When a user hits 'Enter', it should send a search request to the movies API
  - [x] The results from the search should be displayed on the page
  - There should be a close icon with an id of `close-search-btn` that exits the search, clears results, and shows the current movies displayed previously
- [x] Website accounts for basic HTML/CSS accessibility features
- [x] Website should be responsive

#### STRETCH FEATURES

- [x] Deploy website using GitHub Pages. 
- [x] Improve the user experience through CSS & animation (I implemented fade and opacity, and transition time).
- [x] Allow movie video trailers to be played using [embedded YouTube](https://support.google.com/youtube/answer/171780?hl=en)
- [x] Implement anything else that you can get done to improve the app functionality (overview in opaque card)

### Walkthrough Video

![demo](https://user-images.githubusercontent.com/106721607/174413569-8602869b-9460-4d96-941b-933653b6b530.gif)

### Reflection

* Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

Yes!  The topics definitely prepared us.  The API lesson was very helpful.  There wasn't anything specific that I felt unprepared to do.  

* If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.
  
If I had more time, I would spend more time making the website reactive, as well as work no the CSS alignment properties.  I would like to also add a loading button before movie posters render on the page, as well as explore displaying different video types if the trailer doesn't exist.  I would also like to implement a scoll up button, and work on the movie display so that there aren't missing movie positions due to fixed size pagination.  

* Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

The API calls went well, but the css work didn't go as well.  I would like to work more on the transitions!  


### Shout out

Massive shoutout to Vincent for all the help through the project!