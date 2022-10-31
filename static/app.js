document.getElementById('get-genres').addEventListener('click', searchGenre);
// document.getElementById('get-artists').addEventListener('click', getArtists);
// document.getElementById('get-tracks').addEventListener('click', getTracks);
// document.getElementById('get-albums').addEventListener('click', getAlbums);
// use input from user
// genre
function searchGenre(){
    let gInput = document.getElementById("by-genre");       // get input from user
    let sameCase = gInput.value.toLowerCase();    
    let results = [];            // so the comparison is not case-sensitive 

    fetch('/api/genres')
    .then(res => res.json())
    .then(data => {
        // compare input to fetched genres
        for (i = 0; i < data.length; i++) {
            // check if the input matches the inner text or text content
          value = data[i].title; 
          // if the input matches a pokemon name exactly, move it to the top of the array
          if (value.toLowerCase().indexOf(sameCase) > -1) {
            results[i] = data[i].title;    
          } 
      }
        console.log(results);        

        const list = document.getElementById('genre');
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`genre: ${e}`));
            list.appendChild(item);
        });
    })        
    
}

// artists
function searchArtist(){

}

// track
function searchTrack(){

}
// album
function searchAlbum(){

}

// to display all genres
function getGenres(){
    fetch('/api/genres')
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById('genre');
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.title}`));
            list.appendChild(item);
        });
    })
}

function getArtists(){
    fetch('/api/artists')
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById('genre');
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`genre id: ${e.genre_id}`));
            list.appendChild(item);
        });
    })
}

function getTracks(){
    fetch('/api/tracks')
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById('genre');
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`genre id: ${e.genre_id}`));
            list.appendChild(item);
        });
    })
}

function getAlbums(){
    fetch('/api/albums')
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById('genre');
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`genre id: ${e.genre_id}`));
            list.appendChild(item);
        });
    })
}
