const moviesSection = document.querySelector('.movies-section')
const searchBtn = document.querySelector('#search-btn')
const inputValue = document.querySelector('#search-input')
const premiereBtn = document.querySelector('.premier__btn-filter')
const releaseBtn = document.querySelector('.release__btn-filter')
const topBestBtn = document.querySelector('.best__btn-filter')
const upcomingBtn = document.querySelector('.upcoming__btn-filter')

const APIKey = 'b708a630-cac0-45bd-bce4-9d8d8cce2fde'

function getRandomRating()
{
    let randomNumber = (Math.random() * 0.7 + 0.3) * 10
    const multiplier = Math.pow(10, 1 || 0)
    randomNumber = Math.round(randomNumber * multiplier) / multiplier
    return randomNumber
}


//Change to heaert style
moviesSection.addEventListener('click', (event)=>{
    if(event.target.id === 'heart')
    {
        event.target.classList.toggle('heart-active')
    }
})

async function getMovies(type, dataKey)
{
    const url = `https://kinopoiskapiunofficial.tech${type}`
    moviesSection.innerHTML = ''
    try{
        const responce = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'b708a630-cac0-45bd-bce4-9d8d8cce2fde',
                'Content-Type': 'application/json',
            },
        })
        const data = await responce.json()
        console.log(data, dataKey)
        data[dataKey].forEach((element) => {
            const gifContainer = `
            <div id="movie" movieId=${element.kinopoiskId} class="movie-container">
                <div class="movie-info">
                    <div class="movie-info-top">
                        <h3 class="movie-rating">${element.ratingImdb ? element.ratingImdb : getRandomRating()}</h3>
                        <div class="heart" id="heart"></div>
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
    
    }catch (err){
        console.log(err.message)
    }
}

searchBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    getMovies(`/api/v2.1/films/search-by-keyword?keyword=${inputValue.value}`, 'films')

})

premiereBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    getMovies(`/api/v2.2/films/premieres?year=2024&month=JULY`, 'items')
})
releaseBtn.addEventListener('click', (event)=>{
    event.preventDefault()    
    getMovies(`/api/v2.1/films/releases?year=2024&month=JANUARY`, 'releases')
})
topBestBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    // Shrek is the best movie ever
    getMovies(`/api/v2.1/films/search-by-keyword?keyword=шрэк`, 'films')
    // getMovies(`/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1`, 'items')
})
upcomingBtn.addEventListener('click', (event)=>{
    event.preventDefault()    
    getMovies(`/api/v2.2/films/top?type=TOP_AWAIT_FILMS`, 'films')
})

window.addEventListener('load', getMovies('/api/v2.2/films/collections', 'items'))