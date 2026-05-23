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
      results.innerHTML = '';

      data.forEach(function(card) {
        console.log(card.id);
        if(!card.image) return
        if (card.id.startsWith('tcgp')) return;
        if (!card.image) return;

        const img = document.createElement('img');
        img.src = card.image + '/low.webp';
        img.alt = card.name;
        results.appendChild(img);
        
      });
    });
});