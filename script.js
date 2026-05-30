const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector("#search-btn");
const results = document.querySelector("#results");

searchBtn.addEventListener('click', function() {
  const query = searchInput.value;

  

    fetch(`https://api.tcgdex.net/v2/en/cards?name=${query}&category=not:Pocket`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.length > 0 ) {
        // name search card display
        results.innerHTML = '';

        data.forEach(function(card) {

          if (!card.image) return;
          const cardc = document.createElement('div');
          cardc.classList.add('card')
          const img = document.createElement('img');
          img.src = card.image + '/low.webp';
          img.alt = card.name;
          const name = document.createElement('p')
          name.classList.add('card-name');
          const [setId, cardNumber] = card.id.split('-');
          const setinfo = document.createElement('p');
          name.textContent = card.name + ' ' + cardNumber;
          setinfo.classList.add('card-info');
          setinfo.textContent  = setId;

          cardc.appendChild(img);
          cardc.appendChild(name);
          cardc.appendChild(setinfo);
          results.appendChild(cardc);
        
        });
      }

      else {
        // set search card display
        fetch(`https://api.tcgdex.net/v2/en/sets?name=${query}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(sets) {
          if (sets.length === 0) {
            results.innerHTML =' <p>No results found </p>';
            return;
          }
          const setId = sets[0].id;
          fetch(`https://api.tcgdex.net/v2/en/sets/${setId}`)
          .then(function(response) { return response.json();})
          .then(function(setData) {
            results.innerHTML = '';

            setData.cards.forEach(function(card) {

            if (!card.image) return;
            const cardc = document.createElement('div');
            cardc.classList.add('card')
            const img = document.createElement('img');
            img.src = card.image + '/low.webp';
            img.alt = card.name;
            const name = document.createElement('p')
            name.classList.add('card-name');
            const [setId, cardNumber] = card.id.split('-');
            const setinfo = document.createElement('p');
            name.textContent = card.name + ' ' + cardNumber;
            setinfo.classList.add('card-info');
            setinfo.textContent  = setId;

            cardc.appendChild(img);
            cardc.appendChild(name);
            cardc.appendChild(setinfo);
            results.appendChild(cardc);
      
            });

          });
  
        });

      };

    });
});