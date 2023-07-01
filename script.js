const caractersContainer = document.querySelector('.caracters-container'),
      saveConfirmed = document.querySelector('.save-confirmed'),
      loader = document.querySelector('.loader'),
      loadMoreBtn = document.getElementById('loadMore'),
      favoritesBtn = document.getElementById('favorites'),
      toAllBtn = document.getElementById('toAll');


const myKey = '24fb738ede4848e6a32599dd48d52b65';
const offset = 243;
const limit = 33;
const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?&limit=${limit}&offset=${offset}&apikey=${myKey}`;


let caractersArray = [];
let updatedCaractersArray = [];
let favorites = {};



function makeCaracter(page) {
  const currentArray = page === 'results' ? updatedCaractersArray : Object.values(favorites);
  page === 'results' ? toAllBtn.classList.add('hidden') : toAllBtn.classList.remove('hidden');
  page === 'favorites' ? favoritesBtn.classList.add('hidden') : favoritesBtn.classList.remove('hidden')
  currentArray.forEach((res) => {
    // Card
    const card = document.createElement('div');
    card.classList.add('caracter-box');
    // Link
    const link = document.createElement('a');
    link.href = res.urls[1].url;
    link.title = 'Wiki';
    link.target = '_blank';
    // Img
    const img = document.createElement('img');
    img.classList.add('thumbnail');
    img.src = res.thumbnail.path + '.' + res.thumbnail.extension;
    // Caracter's Body
    const caractersBody = document.createElement('div');
    caractersBody.classList.add('caractersBodyStyle');
    // Caracter's Name
    const name = document.createElement('h3');
    name.classList.add('name');
    name.textContent = res.name;
     // Save Text 
     const saveText = document.createElement('p');
     saveText.classList.add('clickable');
     if (page === 'results') {
       saveText.textContent = 'Add to favorites';
       saveText.setAttribute('onclick', `saveFavorite('${res.urls[1].url}')`); 
     } else {
       saveText.textContent = 'Remove favorite';
       saveText.setAttribute('onclick', `removeFavorite('${res.urls[1].url}')`); 
     }
    // Caracter's Description
    const description = document.createElement('p');
    description.textContent = res.description ? res.description : 'There is no information about this character';
    // Append
    caractersContainer.append(card);
    link.append(img);
    card.append(link, caractersBody);
    caractersBody.append(name, saveText, description);
    console.log(card);
    // Hide loader
    loader.classList.add('hidden');
  });
}

function updateCharacter(page) {
  // Get Favorites from Local Storage
  if (localStorage.getItem('marvelFavorites')) {
    favorites = JSON.parse(localStorage.getItem('marvelFavorites'));
  }
  caractersContainer.textContent = '';
  makeCaracter(page);
}

// Add result to Favorites
function saveFavorite(itemUrl) {
  console.log(itemUrl);
  // Loop through Results Array to select Favorite
  updatedCaractersArray.forEach((item) => {
    if (item.urls[1].url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 seconds 
      saveConfirmed.style.display = 'block';
      setTimeout(() => {
        saveConfirmed.style.display = 'none';
      }, 2000);
      // Set favorites in localStorage
      localStorage.setItem('marvelFavorites', JSON.stringify(favorites));
    }
  })

}

// Remove item from favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Set favorites in localStorage
    localStorage.setItem('marvelFavorites', JSON.stringify(favorites));
    updateCharacter('results');
  }
}


// Get Data from Api
async function getCaractersFromApi() {
  loader.classList.remove('hidden');
  const response = await fetch(apiUrl);
  caractersArray = await response.json();

  updatedCaractersArray = caractersArray.data.results;

  console.log(updatedCaractersArray);
  makeCaracter('results');
}


// Event Listeners
favoritesBtn.addEventListener('click', () => {
  updateCharacter('favorites');
})

toAllBtn.addEventListener('click', () => {
  updateCharacter('results');
})

loadMoreBtn.addEventListener('click', () => {
  getCaractersFromApi(apiUrl);
})



getCaractersFromApi();
