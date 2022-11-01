document.getElementById('all-genres').addEventListener('click', getGenres);
document.getElementById('artist-btn').addEventListener('click', getArtists);
document.getElementById('album-btn').addEventListener('click', getAlbums);
document.getElementById('track-btn').addEventListener('click', getTracks);
// document.getElementById('get-tracks').addEventListener('click', getTracks);
// document.getElementById('get-albums').addEventListener('click', getAlbums);
// use input from user
// genres

// function searchGenre(){
//     let gInput = document.getElementById("by-genre");       // get input from user
//     let sameCase = gInput.value.toLowerCase();    
//     let results = [];            // so the comparison is not case-sensitive 

//     fetch('/api/genres')
//     .then(res => res.json())
//     .then(data => {
//         // compare input to fetched genres
//         for (i = 0; i < data.length; i++) {
//             // check if the input matches the inner text or text content
//           value = data[i].title; 
//           // if the input matches a genre name exactly, move it to the top of the array
//           if (value.toLowerCase().indexOf(sameCase) > -1) {
//             results[i] = data[i].title;    
//           } 
//       }
//         console.log(results);        

//         const list = document.getElementById('genre');
//         data.forEach(e => {
//             const item = document.createElement('li')
//             item.appendChild(document.createTextNode(`genre: ${e}`));
//             list.appendChild(item);
//         });
//     });        
    
// }

// artists ID 
// should be a number
function searchArtist(){
    let artInput = document.getElementById("by-artist");       // get input from user
    let results = [];            // so the comparison is not case-sensitive 
    fetch('/api/artists')
    .then(res => res.json())
    .then(data => {
        // compare input to fetched genres
        for (i = 0; i < data.length; i++) {
            // check if the input matches the inner text or text content
          value = data[i].artist_id; 
          // if the input matches an artist name exactly, move it to the top of the array
          if (value.indexOf(artInput.value) > -1) {
            results[i] = data[i].artist_id;    
          } 
        }
        console.log(results);        

        const list = document.getElementById('artist-info');
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.artist_id} ${e.artist_images} name: ${e.artist_name} About: ${e.artist_bio} Members: ${e.artist_members} Website: ${e.artist_website} Date created: ${e.artist_date_created}`));
            list.appendChild(item);
        });
    })        
}

// track
function searchTrack(){

}
// album
function searchAlbum(){

}

// to toggle the display of all genres
function getGenres(){
    const list = document.getElementById('genre-list');
    const genre_div = document.getElementById('genre')
    genre_div.classList.toggle('hide');
    if(genre_div.classList){
        clear(list);
    }
    fetch('/api/genres')
    .then(res => res.json())
    .then(data => {
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.genre_id}. Genre: ${e.title} Genre parent ID: ${e.parent}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })
}

function getArtists(){
    const list = document.getElementById('genre-list');
    const genre_div = document.getElementById('genre')
    genre_div.classList.toggle('hide');
    if(genre_div.classList){
        clear(list);
    }
    fetch('/api/artists')
    .then(res => res.json())
    .then(data => {
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.artist_id}. Artists:: ${e.artist_name}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })
}

function getTracks(){
    const list = document.getElementById('genre-list');
    const genre_div = document.getElementById('genre')
    genre_div.classList.toggle('hide');
    if(genre_div.classList){
        clear(list);
    }
    fetch('/api/tracks')
    .then(res => res.json())
    .then(data => {
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.track_id}. Track: ${e.track_title}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })
}

function getAlbums(){
    const list = document.getElementById('genre-list');
    const genre_div = document.getElementById('genre')
    genre_div.classList.toggle('hide');
    if(genre_div.classList){
        clear(list);
    }
    fetch('/api/albums')
    .then(res => res.json())
    .then(data => {
        data.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.album_id}. Album: ${e.album_date_created}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })
}

function clear(element){
    while(element.firstChild){
      element.removeChild(element.firstChild);
    }
  }