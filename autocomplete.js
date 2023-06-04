const createAutoComplete = ({ 
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData
 }) => {
    root.innerHTML = `
        <label><b>Search <i class="fas fa-search"></i></b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input1 = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async e =>{
        const items = await fetchData(e.target.value);
        if(!items.length){
            dropdown.classList.remove('is-active');
            return;
        }
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for(let item of items){
            const choice = document.createElement('a');
            choice.classList.add('dropdown-item')
            choice.innerHTML = renderOption(item);
            choice.addEventListener('click', () =>{
                dropdown.classList.remove('is-active');
                input1.value = inputValue(item);
                onOptionSelect(item);
            })
            resultsWrapper.appendChild(choice)
        }
    };
    input1.addEventListener('input', debounce(onInput, 750));
    document.addEventListener('click', e =>{
        if(!root.contains(e.target)){
            dropdown.classList.remove('is-active');
        }
    })
};