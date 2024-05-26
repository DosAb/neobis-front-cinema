const moviesSection = document.querySelector('.movies-section')
const searchBtn = document.querySelector('#search-btn')
const inputValue = document.querySelector('#search-input')
const premiereBtn = document.querySelector('.premier__btn-filter')
const releaseBtn = document.querySelector('.release__btn-filter')
const topBestBtn = document.querySelector('.best__btn-filter')
const upcomingBtn = document.querySelector('.upcoming__btn-filter')
const favoritesBtn = document.querySelector('.favorites__btn')

// const APIKey = 'b708a630-cac0-45bd-bce4-9d8d8cce2fde'
const APIKey = 'f35c0ed1-b929-4f42-8e83-348e935c1beb'

let loadOnScroll = false
let currentSection = 'main'
let mainPageCount = 1

function getRandomRating()
{
    let randomNumber = (Math.random() * 0.7 + 0.3) * 10
    const multiplier = Math.pow(10, 1 || 0)
    randomNumber = Math.round(randomNumber * multiplier) / multiplier
    return randomNumber
}


let moviesIdArray = JSON.parse(localStorage.getItem('id')) ? JSON.parse(localStorage.getItem('id')) : []

        // FETCH THE DATA

async function getMovies(link, dataKey, clear = false)
{
    const url = link
    clear ? null : moviesSection.innerHTML = '' 
    try{
        const responce = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': APIKey,
                'Content-Type': 'application/json',
                'mode': 'no-cors'
            },
        })
        const data = await responce.json()
        data[dataKey].forEach((element) => {
            let isFavorite = false
            moviesIdArray.map((movieID=>{
                if(element.kinopoiskId){
                    if(movieID == element.kinopoiskId){
                        isFavorite = true
                    }
                }else{
                    if(movieID == element.filmId){
                        isFavorite = true
                    }
                }
            }))
            const gifContainer = `
            <div id="movie" movieId=${element.kinopoiskId ? element.kinopoiskId : element.filmId} class="movie-container">
                <div class="movie-info">
                    <div class="movie-info-top">
                        <h3 class="movie-rating">${element.ratingImdb ? element.ratingImdb : getRandomRating()}</h3>
                        <div class="heart ${isFavorite ? 'heart-active' : ''}" id="heart"></div>
                    </div>
                    <div class="movie-info-bottom">
                        <h4 class="movie-title">${element.nameRu}</h4>
                        <h4 class="movie-genre">${element.genres[0].genre}</h4>
                    </div>
                </div>
                <img class="test-img" src=${element.posterUrl} alt="gif">
            </div>
        `
        moviesSection.insertAdjacentHTML('beforeend', gifContainer)
        })

        if(clear == true)
        {
            loadOnScroll = false
        }
    
    }catch (err){
        console.log(err.message)
    }
}

async function getFavorites(link)
{
    // const url = `https://kinopoiskapiunofficial.tech${link}`
    const url = link
    moviesSection.innerHTML = ''
    try{
        const responce = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': APIKey,
                'Content-Type': 'application/json',
            },
        })
        const data = await responce.json()
        const gifContainer = `
        <div class="favorites-section">        
            <div id="movie" movieId=${data.kinopoiskId} class="movie-container">
                <div class="movie-info">
                    <div class="movie-info-top">
                        <h3 class="movie-rating">${data.ratingImdb ? data.ratingImdb : getRandomRating()}</h3>
                        <div class="heart heart-active" id="heart"></div>
                    </div>
                    <div class="movie-info-bottom">
                        <h4 class="movie-title">${data.nameRu}</h4>
                        <h4 class="movie-genre">${data.genres[0].genre}</h4>
                    </div>
                </div>
                <img class="test-img" src=${data.posterUrl} alt="gif">
            </div>
        </div>
        `
        moviesSection.insertAdjacentHTML('beforeend', gifContainer)
    
    }catch (err){
        console.log(err.message)
    }
}

//Display favorites


    // EVENT LISTENERS
getMovies('https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1', 'items')

searchBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    currentSection = 'search'
    getMovies(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${inputValue.value}`, 'films')

})
premiereBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    currentSection = 'premiers'
    getMovies(`https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=JULY`, 'items')
})
releaseBtn.addEventListener('click', (event)=>{
    event.preventDefault()    
    currentSection = 'releases'
    getMovies(`https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2024&month=MAY`, 'releases')
})
topBestBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    currentSection = 'best'
    // Shrek is the best movie ever
    getMovies(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=шрэк`, 'films')
    // getMovies(`/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1`, 'items')
})
upcomingBtn.addEventListener('click', (event)=>{
    event.preventDefault()    
    currentSection = 'upcoming'
    getMovies(`https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS`, 'films')
})

window.addEventListener('scroll', ()=>{
    const scrolledTo = window.scrollY + window.innerHeight
    const threshold = 300
    const isReachBottom = document.body.scrollHeight - threshold <= scrolledTo

    if (isReachBottom && currentSection == 'main') {
        if(loadOnScroll == false){
            loadOnScroll = true
            getMovies(`https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=${mainPageCount + 1}`, 'items', true)
            mainPageCount += 1 
        }
    }
})


//Change to heaert style
moviesSection.addEventListener('click', (event)=>{

    if(event.target.id === 'heart')
    {
        event.target.classList.toggle('heart-active')
        const movieElement = event.target.closest('.movie-container')

        if(event.target.classList.contains('heart-active'))
        {
            moviesIdArray.push(movieElement.getAttribute('movieId'))
            localStorage.setItem('id', JSON.stringify(moviesIdArray))
        }else{
            moviesIdArray = moviesIdArray.filter(item => item !== movieElement.getAttribute('movieId'))
            localStorage.setItem('id', JSON.stringify(moviesIdArray))
        }
    }
})


favoritesBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    moviesSection.innerHTML = ''
    moviesIdArray.forEach((id)=>{

        getFavorites(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}` )
    })
    console.log('favorites')
})