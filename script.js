const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector("#search-btn");
const results = document.querySelector("#results");
const autoSearchResults = document.querySelector('#search-results')
const openSearchBtn = document.querySelector('#open-search-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');
const modalOverlay = document.querySelector('#modal-overlay');

openSearchBtn.addEventListener('click', function() {
  modalOverlay.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', function() {
  modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
});


searchBtn.addEventListener('click', function() {
  const query = searchInput.value;

  fetch(`https://api.tcgdex.net/v2/en/sets?name=${query}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(sets) {
      if (sets.length > 0) {
        const setId = sets[0].id;
        fetch(`https://api.tcgdex.net/v2/en/sets/${setId}`)
          .then(function(response) { return response.json(); })
          .then(function(setData) {
            results.innerHTML = '';

            const visibleCards = setData.cards.filter(function(card) {
              return card.image;
            });

            if (visibleCards.length === 0) {
              fetch(`https://api.tcgdex.net/v2/en/cards?name=${query}&category=not:Pocket`)
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                  if (data.length === 0) {
                    results.innerHTML = '<p>No results found</p>';
                    return;
                  }
                  results.innerHTML = '';

                  data.forEach(function(card) {
                    if (!card.image) return;
                    const cardc = document.createElement('div');
                    cardc.classList.add('card');
                    const img = document.createElement('img');
                    img.src = card.image + '/low.webp';
                    img.alt = card.name;
                    const name = document.createElement('p');
                    name.classList.add('card-name');
                    const [setId, cardNumber] = card.id.split('-');
                    const setinfo = document.createElement('p');
                    name.textContent = card.name + ' ' + cardNumber;
                    setinfo.classList.add('card-info');
                    setinfo.textContent = setId;
                    cardc.appendChild(img);
                    cardc.appendChild(name);
                    cardc.appendChild(setinfo);
                    results.appendChild(cardc);
                  });
                });
              return;
            }

            visibleCards.forEach(function(card) {
              const cardc = document.createElement('div');
              cardc.classList.add('card');
              const img = document.createElement('img');
              img.src = card.image + '/low.webp';
              img.alt = card.name;
              const name = document.createElement('p');
              name.classList.add('card-name');
              const [setId, cardNumber] = card.id.split('-');
              const setinfo = document.createElement('p');
              name.textContent = card.name + ' ' + cardNumber;
              setinfo.classList.add('card-info');
              setinfo.textContent = setId;
              cardc.appendChild(img);
              cardc.appendChild(name);
              cardc.appendChild(setinfo);
              const addBtn = document.createElement('button');
                addBtn.classList.add('add-btn');
                addBtn.textContent = '+ Add';
                addBtn.addEventListener('click', function() {
                  addToWishlist(card);
                });
              cardc.appendChild(addBtn);
              results.appendChild(cardc);
            });
          });
      } else {
        fetch(`https://api.tcgdex.net/v2/en/cards?name=${query}&category=not:Pocket`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.length === 0) {
              results.innerHTML = '<p>No results found</p>';
              return;
            }
            results.innerHTML = '';

            data.forEach(function(card) {
              if (!card.image) return;
              const cardc = document.createElement('div');
              cardc.classList.add('card');
              const img = document.createElement('img');
              img.src = card.image + '/low.webp';
              img.alt = card.name;
              const name = document.createElement('p');
              name.classList.add('card-name');
              const [setId, cardNumber] = card.id.split('-');
              const setinfo = document.createElement('p');
              name.textContent = card.name + ' ' + cardNumber;
              setinfo.classList.add('card-info');
              setinfo.textContent = setId;
              cardc.appendChild(img);
              cardc.appendChild(name);
              cardc.appendChild(setinfo);

              const addBtn = document.createElement('button');
              addBtn.classList.add('add-btn');
              addBtn.textContent = '+ Add';
              addBtn.addEventListener('click', function() {
                addToWishlist(card);
              });
              cardc.appendChild(addBtn);

              results.appendChild(cardc);
            });
          });
      }
    });
});

searchInput.addEventListener('input', function() {
  const query = searchInput.value;

  if (query.length === 0) {
    autoSearchResults.innerHTML = '';
    return;
  }

  Promise.all([
    fetch(`https://api.tcgdex.net/v2/en/sets?name=${query}&pagination:itemsPerPage=50`).then(r => r.json()),
    fetch(`https://api.tcgdex.net/v2/en/cards?name=${query}&pagination:itemsPerPage=50`).then(r => r.json())
  ])
  .then(function(results) {
    const sets = results[0];
    const cards = results[1];

    autoSearchResults.innerHTML = '';
    let setcount =0;
    sets.forEach(function(set) {
      if (setcount>=3) return;
      setcount++;
      const setName = document.createElement('p');
      setName.classList.add('set');
      setName.textContent = set.name + ' (set)';
      setName.addEventListener('click', function() {
        searchInput.value = set.name;
        autoSearchResults.innerHTML = '';
        searchBtn.click();
      });
      autoSearchResults.appendChild(setName);
    });

    const uniqueNames = new Set();
    cards.forEach(function(card) {
      uniqueNames.add(card.name);
    });
    let count = 0;
    uniqueNames.forEach(function(uniquecard) {
      if (count >=8) return;
      count++;
      const uniqueCard = document.createElement('p');
      uniqueCard.classList.add('suggestion'); 
      uniqueCard.textContent = uniquecard;
      uniqueCard.addEventListener('click', function() {
        searchInput.value = uniquecard;
        autoSearchResults.innerHTML = '';
        searchBtn.click();
      });
      autoSearchResults.appendChild(uniqueCard);
    });
  });
});
searchInput.addEventListener('blur', function() {
  setTimeout(function() {
    autoSearchResults.innerHTML = '';
  }, 200);
});

// wishlist
function getWishlist() {
  const stored = localStorage.getItem('wishlist');
  return stored ? JSON.parse(stored) : [];
}

function saveWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

function addToWishlist(card) {
  const wishlist = getWishlist();
  wishlist.push(card);
  saveWishlist(wishlist);
  renderwishlist();
}

function renderwishlist() {
  const wishlist = getWishlist();
  const container = document.getElementById('wishlist');
  container.innerHTML = '';

  wishlist.forEach(function(card, index) {

    const item = document.createElement('div');
    item.classList.add('card')

    const img = document.createElement('img');
    img.src = card.image + '/low.webp';
    img.alt = card.name;
    
    const name = document.createElement('p');
    name.classList.add('card-name');
    name.textContent = card.name;

    const [setId, cardNumber] = card.id.split('-');
    const setinfo = document.createElement('p');
    setinfo.classList.add('card-info');
    setinfo.textContent = setId;

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', function() {
      removeFromWishlist(index);
    });

    item.appendChild(removeBtn);
    container.appendChild(item);

    item.appendChild(img);
    item.appendChild(name);
    item.appendChild(setinfo);
    item.appendChild(removeBtn);
    container.appendChild(item);
  });
}

function removeFromWishlist(index) {
  const wishlist = getWishlist();
  wishlist.splice(index, 1);   
  saveWishlist(wishlist);             
  renderwishlist();                   
}

renderwishlist();