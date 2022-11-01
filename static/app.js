document.getElementById('all-genres').addEventListener('click', getGenres);
document.getElementById('artist-btn').addEventListener('click', artistDetails);
document.getElementById('artist-name-btn').addEventListener('click', getArtistList);
// document.getElementById('album-btn').addEventListener('click', getAlbums);
document.getElementById('track-btn').addEventListener('click', getTrackList);
document.getElementById('track-id-btn').addEventListener('click', trackDetails);
const n = 10;
// use input from user

// current function:
// artistDetails()
// getArtistList()
// trackDetails()
// getTrackList()
// getGenres()
// clear()

// get artist details by knowing artist id
function artistDetails(){
    let artInput = document.getElementById("by-artist");       // get input from user
    const list = document.getElementById('artist-list');
    const header = document.getElementById('h-art');
    let results = [];            // so the comparison is not case-sensitive 
    clear(list);
    clear(header);
    fetch('/api/artists')
    .then(res => res.json())
    .then(data => {
        // compare input to fetched genres
        for (i = 0; i < data.length; i++) {
            // check if the input matches the inner text or text content
          value = data[i].artist_id; 
          // if the input matches an artist name exactly, move it to the top of the array
          if (value === artInput.value) {
            results[i] = data[i];    
          } 
        }       
        header.append(document.createTextNode(`Artist results for: ${artInput.value}`))
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.artist_id}. ${e.artist_name} - ${e.artist_images} name: ${e.artist_name} About: ${e.artist_bio} Members: ${e.artist_members} Website: ${e.artist_website} Date created: ${e.artist_date_created}`));
            item.classList.add("box")
            list.appendChild(item);
            
        });
    })        
}

// get list of artists by searching by name
function getArtistList(){
    let artInput = document.getElementById("by-art-name");       // get input from user
    const list = document.getElementById('artist-list');
    const header = document.getElementById('h-art');
    let results = [];            // so the comparison is not case-sensitive 
    clear(list);
    clear(header);
    if((artInput.value === "")){
        header.append(document.createTextNode(`Please enter a search value`))
    }else

    fetch('/api/artists')
    .then(res => res.json())
    .then(data => {
        // compare input to fetched genres
        for (i = 0; i < data.length; i++) {
            // check if the input matches the inner text or text content
          value = data[i].artist_name; 
          // if the input matches an artist name exactly, move it to the top of the array
          if (value.toLowerCase().indexOf(artInput.value.toLowerCase()) > -1) {
            results[i] = data[i];    
          } 
        }       
        header.append(document.createTextNode(`Artist results for: ${artInput.value}`))
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.artist_id}. ${e.artist_name}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })   
}

// to get track details
function trackDetails(){
    let traInput = document.getElementById("by-track-id");       // get input from user
    const list = document.getElementById('track-list');
    const header = document.getElementById('h-track');
    let results = [];            // so the comparison is not case-sensitive 
    clear(list);
    clear(header);
    if((traInput.value === "")){
        header.append(document.createTextNode(`Please enter a search value`))
    }else
    fetch('/api/tracks')
    .then(res => res.json())
    .then(data => {
        // compare input to fetched genres
        for (i = 0; i < data.length; i++) {
            // check if the input matches the inner text or text content
          value = data[i].track_id; 
          // if the input matches an artist name exactly, move it to the top of the array
          if (value === traInput.value) {
            results[i] = data[i];    
          } 
        }       
        if(results.length == 0){
            header.append(document.createTextNode(`No search results found for: ${traInput.value}`))
        }else
        header.append(document.createTextNode(`Track result for id number ${traInput.value}`))
        results.forEach(e => {
            console.log(e);
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.track_id}. ${e.album_id}  ${e.album_title} : ${e.artist_id} : ${e.artist_name} : ${e.tags} : ${e.track_date_created} : ${e.track_date_recorded} : ${e.track_duration} : ${e.track_genres} : ${e.track_number} : ${e.track_title}`));
            item.classList.add("box")
            list.appendChild(item);
            
        });
    })        
}


// to get a list of tracks by searching by album title or by album name
function getTrackList(){
    let traInput = document.getElementById("by-track");       // get input from user
    const list = document.getElementById('track-list');
    const header = document.getElementById('h-track');
    let results = [];            // so the comparison is not case-sensitive 
    let counter = 0;
    clear(list);
    clear(header);
    fetch('/api/tracks')
    .then(res => res.json())
    .then(data => {
        // compare input to fetched genres
        for (i = 0; i < data.length; i++) {
            // check if the input matches the inner text or text content
          value = data[i].track_title; 
          value2 = data[i].album_title;
          // if the input matches an artist name exactly, move it to the top of the array
          if ((value.toLowerCase().indexOf(traInput.value.toLowerCase()) > -1 || value2.toLowerCase().indexOf(traInput.value.toLowerCase()) > -1) && counter < n) {
            results[i] = data[i]; 
            counter++;   
          } 
        }       
        header.append(document.createTextNode(`Track results for: ${traInput.value}`))
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.track_id}. ${e.track_title}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })        
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

// function getArtists(){
//     const list = document.getElementById('genre-list');
//     const genre_div = document.getElementById('genre')
//     genre_div.classList.toggle('hide');
//     if(genre_div.classList){
//         clear(list);
//     }
//     fetch('/api/artists')
//     .then(res => res.json())
//     .then(data => {
//         data.forEach(e => {
//             const item = document.createElement('li')
//             item.appendChild(document.createTextNode(`${e.artist_id}. Artists:: ${e.artist_name}`));
//             item.classList.add("box")
//             list.appendChild(item);
//         });
//     })
// }

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