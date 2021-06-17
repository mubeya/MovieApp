const APIKEY = config.APIKEY;
const APIURL = config.APIURL;
const GENREAPIURL = config.GENREAPIURL;
const IMGPATH = config.IMGPATH;
const SEARCHAPI = config.SEARCHAPI;
const TOPRATEDURL = config.TOPRATEDURL;
const UPCOMINGURL = config.UPCOMINGURL;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("searchInput");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");


getMovies(APIURL);

async function getMovies(url){
    const resp = await fetch(url);
    const respData = await resp.json();

    showMovies(respData.results);  // results : json object name from api
}


function showMovies(movies){
  
    main.innerHTML =``;  //clear main area
    movies.forEach((movie) => {   
        const {id, poster_path, title, vote_average, overview, genre_ids} = movie;
        const  movieEl = document.createElement("div");    //create "movie" class div in main area
        movieEl.classList.add("movie");

        fetch(GENREAPIURL).then(res => res.json()).then((genreData) => {   //get movie genre from API
            const movieGenre1 = genreData.genres.find(item => item.id === genre_ids[0]);
            const movieGenre2 = genreData.genres.find(item => item.id === genre_ids[1]);

            const TRAILERURL = "https://api.themoviedb.org/3/movie/"+id+"/videos?api_key=" + APIKEY;  // get movie trailer from another API
            fetch(TRAILERURL).then(res => res.json()).then(res => {let youtube = "https://www.youtube.com/embed/" + res.results[0].key;

            movieEl.innerHTML = `
            <span class="movie-vote"><i class="fa fa-star"></i>${vote_average}</span>
            <img 
                class="image"
                src="${IMGPATH + poster_path}" 
                alt="${title}" />
            <div class="movie-info">
            <div><p class="title">${title}</p></div>
            <div>
                <span class="detail">Details</span>
                <button id="${id}" class="similar" onclick="similarMovies(this.id)">Similar Movies</button>
                <p class="genre">${movieGenre1.name} / ${movieGenre2.name}</p>
            </div> 
            </div> 
            <div class="modal-overlay">
            <div class="modal-container">
                <h3>Overview</h3>
                <p style="margin: 20px auto;">${overview}</p>
                <h4>Trailer</h4>
                <iframe width="420" height="315" src="${youtube}"></iframe>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            </div>`;
            
            main.appendChild(movieEl);
          
            const detailBtns = document.querySelectorAll(".detail");   
            const similarBtns = document.querySelectorAll(".similar");     
            const modals = document.querySelectorAll(".modal-overlay");
            const closeBtns = document.querySelectorAll(".close-btn");
                  
            
            detailBtns.forEach(function(detailBtn,index){         // open modal popup for overview
               detailBtn.addEventListener("click", function(){
                   modals[index].classList.add("open-modal");
               }); 
       
               closeBtns[index].addEventListener("click", function(){
               modals[index].classList.remove("open-modal");  
               });  
            });
         }); 
       });        
    });
}

function similarMovies(id){
    const SIMILARURL =  "https://api.themoviedb.org/3/movie/"+ id +"/similar?api_key="+APIKEY;
    getMovies(SIMILARURL);
}

function topRatedMovies(){
    getMovies(TOPRATEDURL);
}

function upcomingMovies(){
    getMovies(UPCOMINGURL);
}

form.addEventListener("submit", (e) =>{
    e.preventDefault()

    const searchTerm = search.value;   // get searching words

    if(searchTerm){
        getMovies(SEARCHAPI + searchTerm);
        search.value = "";
    }
});

let pageCount = 1;
nextBtn.addEventListener("click", function(){     //move to next page
    pageCount = pageCount + 1;
    getMovies(APIURL + "&page=" + pageCount);
    
    prevBtn.classList.remove("hide");
    
});

prevBtn.addEventListener("click", function(){     //move to previous page
    pageCount = pageCount - 1;
    getMovies(APIURL + "&page=" + pageCount);
    
    if(pageCount==1){
        prevBtn.classList.add("hide");
    }
});

