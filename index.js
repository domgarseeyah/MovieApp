

// // Take out async reference in index so it isn't attached directly
// const fetchData = async (searchTerm) => {
//     const response = await axios.get('http://www.omdbapi.com/', {
//         params:{
//             apikey: 'a0a422af',
//             s: searchTerm
//         }})
//         if(response.data.Error){
//             return [];
//         }
//         return response.data.Search;
//       };
//


const autoCompleteConfig = {
// Make an object to allow for a more readable and scalable create instance. 
    renderOption: (movie) =>{
        const imgSource =  movie.Poster ==='N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSource}" />
        ${movie.Title} &nbsp; <em>(${movie.Year})</em>
    `
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    async fetchData(searchTerm){
        const response = await axios.get('http://www.omdbapi.com/', {
            params:{
                apikey: 'a0a422af',
                s: searchTerm
            }})
            if(response.data.Error){
                return [];
            }
        return response.data.Search;
        } 
}

// ... is used to create a copy of the object
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});


// // Refactor into auto for a better reusable template
// const root = document.querySelector('.autocomplete');

// root.innerHTML = `
//     <label><b>Search for movie</b></label>
//     <input class="input" />
//     <div class="dropdown">
//         <div class="dropdown-menu">
//         <div class="dropdown-content results"></div>
//         </div>
//     </div>
// `;
// const input1 = document.querySelector('input');
// const dropdown = document.querySelector('.dropdown');
// const resultsWrapper = document.querySelector('.results');
// const onInput = async e =>{
//     const movies = await fetchData(e.target.value);
//     if(!movies.length){
//         dropdown.classList.remove('is-active');
//         return;
//     }
//     resultsWrapper.innerHTML = '';
//     dropdown.classList.add('is-active');
//     for(let movie of movies){
//         const choice = document.createElement('a');
//         const imgSource =  movie.Poster ==='N/A' ? '' : movie.Poster;
//         choice.classList.add('dropdown-item')
//         choice.innerHTML = `
//             <img src="${imgSource}" />
//             ${movie.Title}
//         `;
//         choice.addEventListener('click', () =>{
//             input1.value = movie.Title;
//             dropdown.classList.remove('is-active');
//             onMovieSelect(movie);
//         })
//         resultsWrapper.appendChild(choice)
//     }
// };
// input1.addEventListener('input', debounce(onInput, 750));
// document.addEventListener('click', e =>{
//     if(!root.contains(e.target)){
//         dropdown.classList.remove('is-active');
//     }
// })

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, pageSide) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey: 'a0a422af',
            i: movie.imdbID
        }});
        // console.log(summaryElement)
       summaryElement.innerHTML = movieTemplate(response.data);

       if (pageSide ==='left'){
        leftMovie = response.data;
       } else{
        rightMovie = response.data;
       }

       if(leftMovie && rightMovie){
        runComparison();
       }

};
const runComparison = () =>{
    const leftSideInfo = document.querySelectorAll('#left-summary .notification');
    const rightSideInfo = document.querySelectorAll('#right-summary .notification');
    leftSideInfo.forEach((leftInfo, index) =>{
        const rightInfo = rightSideInfo[index];
        const leftValue = parseInt(leftInfo.dataset.value);
        const rightValue = parseInt(rightInfo.dataset.value);
        if(rightValue > leftValue){
            leftInfo.classList.replace('is-primary', 'is-warning');
        } else{
            rightInfo.classList.replace('is-primary', 'is-warning');

        }

    })

}

const movieTemplate = (movieDetail) =>{
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const rating = parseFloat(movieDetail.imdbRating);
    const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    // let count = 0;
    // // split to get array and check for numbers to add to count using a forEach loop.
    // const awards = movieDetail.Awards.split(' ').forEach((word) => {
    //     const value = parseInt(word);
    //     if(isNaN(value)){
    //         return;
    //     } else{
    //         count = count + value;
    //     }
    // });
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        // Able to use a reduce function to add to award total
        // Takes two arguments, the function to run and a starting value to work with
        const value = parseInt(word);
        if (isNaN(value)){
            return prev;
        } else{
            return prev + value;
        }

    }, 0);
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}<h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${rating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};

// Adding delay to search input to limit the amount of requests being made
// let timeoutId;      
// const onInput = (e) =>{
//     if(timeoutId){
//         clearTimeout(timeoutId);
//     }
//     timeoutId = setTimeout(() =>{
//         search1 = e.target.value;
//         fetchData(search1)
//     }, 500)
    
// }
// const input1 = document.querySelector('#input1');
// input1.addEventListener('input', onInput);
