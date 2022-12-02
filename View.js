let listItem = [];
let listCategory = [];
let page = 1;
let pageSize = 10;
let total_page = 0;
const totalItem = 90;

const q = 'business'

let per_user = [];
const apiKey = '49821bfbab3f43a4b5e115590f78920c';

const params = {
    page,
    pageSize,
    language,
    apiKey,
    q,
}


function handleClick(num){
    page = num + 1;
    listItem.articles = listItem.articles.slice(
        (page - 1) * pageSize,
        (page - 1) * pageSize + pageSize
    )
    loadItem(page,10);

    displayItem(listItem.articles);
}
function renderPageNumber() {
    total_page = Math.ceil(totalItem / pageSize);
    for (let i = 1; i <= total_page; i++) {
        document.getElementById("pagination").innerHTML += `<li onclick="handleClick(${i})">${i}</li>`
    }
}


const handleChangeTheme = (e) =>{
    const paramSearch = {
        ...params,
        theme: e.target.value
    }
    loadItem(page,pageSize);
}

const handleChangeLanguage = (e) => {
    const paramSearch = {
        ...params,
        language: e.target.value
    }

    loadItem(paramSearch)
}
const handleChangeCountry = (e) => {
    const paramSearch = {
        
        coutry: e.target.value
    }
    loadCategory(page, 10)
}

const loadItem = async (page, pageSize) => {
    let language = document.getElementById('language').value;
    let theme = document.getElementById('theme').value;
    try {
        const elData = document.getElementById('show-content');
        elData.innerHTML = '';
        const elLoading = document.getElementById('loading');

        elLoading.classList.add("loading");
        const res = await fetch(`https://newsapi.org/v2/everything?apiKey=${apiKey}&q=${theme}&page=${page}&pageSize=${pageSize}&language=${language}`);
    
        listItem = await res.json();
        displayItem(listItem.articles);
        
        elLoading.classList.remove("loading");

    } catch (error) {
        console.error(error);
    } 
}

const loadCategory = async (page, pageSize)=>{
    try {
        const country = document.getElementById('country').value;
        const theme = document.getElementById('theme').value;

        const resCategory = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}&category=${theme}`)
        listItem = await resCategory.json();
        displayItem(listItem.articles);
    } catch (error) {
        console.error(error);
    
    }
}

const displayItem = (items) =>{
    const renderItem = items.map((item,index) =>{
        
        return `<div class="content-item">
        <a href=${item.url}><img src=${item.urlToImage ? item.urlToImage : '/favicon.ico'} alt=""></a>
           
           <h2 class="item-title">${item.title}</h2>
           <p>${item.description}</p>
           
           <button class="view-details" data-toggle="modal" data-target="#myModal" onclick="handleClickView(${index})" value = "${index}"> Xem chi tiết </button>
        </div>`
    }).join('');
    document.getElementById('show-content').innerHTML = renderItem;
    
};

let checkIndex;
function handleClickView(id){
    
    const view = document.getElementsByClassName('view-details');
    // console.log(view);
    listItem.articles.map((item, index,arr) =>{
        if(index === id){
            checkIndex = index;
            displayDetails(arr[index]);
        }
    })
}

const displayDetails = (item) =>{
  
    const renderItem = `<div class="content-item">
        <h2>${item.title}</h2>
        <h2>${item.author}</h2>
        <p>${item.description}</p>
        <p>${item.publishedAt}</p>
        <p>${item.content}</p>
        <a href=${item.url}><img src=${item.urlToImage ? item.urlToImage : '/favicon.ico'} alt=""></a>
    </div>`
     document.getElementById('viewModal').innerHTML = renderItem;
    
};

renderPageNumber();


const searchBar  = document.getElementById("search_input_all");
searchBar.addEventListener('keyup', (e)=>{
    const searchString  =  e.target.value.toLowerCase();
    const filterSearch = listItem.articles.filter((item) =>{
        return (
            item.title.toLowerCase().includes(searchString) || item.description.toLowerCase().includes(searchString)
        )
    });
    displayItem(filterSearch);
    
});