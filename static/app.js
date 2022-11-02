document.getElementById('all-genres').addEventListener('click', getGenres);
document.getElementById('artist-btn').addEventListener('click', artistDetails);
document.getElementById('artist-name-btn').addEventListener('click', getArtistList);
// document.getElementById('album-btn').addEventListener('click', getAlbums);
document.getElementById('track-btn').addEventListener('click', getTrackList);
document.getElementById('track-id-btn').addEventListener('click', trackDetails);
document.getElementById('reset-btn').addEventListener('click', reset);

const n = 20;

const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')

// use input from user

// current function:
// artistDetails()
// getArtistList()
// trackDetails()
// getTrackList()
// getGenres()
// clear()
// reset
// search for albums??

// sort by artist name: results.sort(dynamicSort("artist_name")
// sort by track name: results.sort(dynamicSort("track_title")
// sort by album name: results.sort(dynamicSort("album_title")
// sort by length name: results.sort(dynamicSort("track_duration")


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
            const h2 = document.createElement('h2');
            h2.appendChild(document.createTextNode(`${e.artist_id}. Name: ${e.artist_name} `));
            item.appendChild(h2);
            item.appendChild(document.createTextNode(`Contact: ${e.artist_handle} \n`));
            item.appendChild(document.createTextNode(`Members: ${e.artist_members}\n`));
            var a = document.createElement('a');
            a.href = (`${e.artist_website}`);
            a.title = (`${e.artist_website}`);
            a.append(document.createTextNode(`${e.artist_website}\n`));
            item.appendChild(document.createTextNode(`Website: `));
            item.appendChild(a);
            

            item.appendChild(document.createTextNode(`Date created: ${e.artist_date_created}\n`));
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
            break;
          } 
        }       
        if(results.length == 0){
            header.append(document.createTextNode(`No search results found for: ${traInput.value}`))
        }else
        header.append(document.createTextNode(`Track result for id number ${traInput.value}`));
        results.forEach(e => {
            var track_g = e.track_genres;
            console.log(track_g);
            var quoted = track_g.replace(/'/g, '"');
            var parsed = JSON.parse(quoted);
            var g_string = "";

            for (let i = 0; i < parsed.length; i++){
                g_string += parsed[i].genre_title;
                if(i < parsed.length-1){
                    g_string += ', ';
                }
            }

            const item = document.createElement('li')
            const h3 = document.createElement('h3');
            h3.appendChild(document.createTextNode(`${e.track_number}.${e.track_title}`));
            item.appendChild(h3);
            item.appendChild(document.createTextNode(`Album: ${e.album_id}. ${e.album_title}\n`));
            item.appendChild(document.createTextNode(`Artist: ${e.artist_id}. ${e.artist_name}\n`));
            item.appendChild(document.createTextNode(`Tags: ${e.tags.replace(/[\[\]']+/g,'')}\n`));   
            item.appendChild(document.createTextNode(`Track date created: ${e.track_date_created} \nTrack date recorded: ${e.track_date_recorded} \n`));
            item.appendChild(document.createTextNode(`Track length: ${e.track_duration}\n`));
            item.appendChild(document.createTextNode(`Genres: ${g_string}\n`));         
            
            
            
            
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
    if((traInput.value === "")){
        header.append(document.createTextNode(`Please enter a search value`))
    }else
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
        header.append(document.createTextNode(`Top ${n} track results for:  ${traInput.value}`))
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.track_id}. ${e.track_title} (${e.album_title})`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })        
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
            item.appendChild(document.createTextNode(`${e.genre_id}. Genre: ${e.title} - Parent ID: ${e.parent}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })
}

// to clear a search list
function clear(element){
    while(element.firstChild){
      element.removeChild(element.firstChild);
    }
}

// to clear all search results
function reset(){
    // from artist search
    const artList = document.getElementById('artist-list');
    const artHeader = document.getElementById('h-art');
    // from track list
    const trackList = document.getElementById('track-list');
    const trackHeader = document.getElementById('h-track');

    clear(trackList);
    clear(trackHeader);


    clear(artList);
    clear(artHeader);
}

// to sort the data based on a selected property
function dynamicSort(property) {
    return function (a,b) {
     var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
     return result;
 }
}




