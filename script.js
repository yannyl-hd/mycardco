const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector("#search-btn");
const results = document.querySelector("#results");
const autoSearchResults = document.querySelector('#search-results')

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
              results.innerHTML = '<p>No card images available for this set.</p>';
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
    fetch(`https://api.tcgdex.net/v2/en/sets?name=${query}&pagination:itemsPerPage=5`).then(r => r.json()),
    fetch(`https://api.tcgdex.net/v2/en/cards?name=${query}&pagination:itemsPerPage=5`).then(r => r.json())
  ])
  .then(function(results) {
    const sets = results[0];
    const cards = results[1];

    autoSearchResults.innerHTML = '';

    sets.forEach(function(set) {
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

    uniqueNames.forEach(function(uniquecard) {
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