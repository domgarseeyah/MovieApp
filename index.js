

const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey: 'a0a422af',
            s: searchTerm
        }})
        if(response.data.Error){
            return [];
        }
        return response.data.Search;
      };


const onInput = async e =>{
    const movies = await fetchData(e.target.value);
    console.log(movies);
    for(let movie of movies){
        const div = document.createElement('div');

        div.innerHTML = `
            <img src="${movie.Poster}" />
            <h1>${movie.Title}</h1>
        `;
        document.querySelector('#movie1').appendChild(div)
    }
};
const input1 = document.querySelector('#input1');
input1.addEventListener('input', debounce(onInput, 750));

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
