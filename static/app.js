document.getElementById('all-genres').addEventListener('click', getGenres);
document.getElementById('artist-btn').addEventListener('click', artistDetails);
document.getElementById('artist-name-btn').addEventListener('click', function(){
    getArtistList("artist_id");
});
// document.getElementById('album-btn').addEventListener('click', getAlbums);
document.getElementById('track-btn').addEventListener('click', function(){
    getTrackList("track_id");
});
document.getElementById('track-id-btn').addEventListener('click', trackDetails);
document.getElementById('reset-btn').addEventListener('click', reset);

document.getElementById("sort-artist-btn").addEventListener('click', function(){
    getArtistList("artist_name");
});
document.getElementById("sort-album-btn").addEventListener('click', function(){
    getTrackList("album_title");
});
document.getElementById("sort-track-btn").addEventListener('click', function(){
    getTrackList("track_title");
});
document.getElementById("sort-length-btn").addEventListener('click', function(){
    getTrackList("track_duration");
});
// document.getElementById("temp").addEventListener('click', playlistTracks)

document.getElementById('btn-create').addEventListener('click', addPlaylist);
document.getElementById('btn-delete').addEventListener('click', deletePlaylist);
document.getElementById('btn-add-tracks').addEventListener('click', editPlaylist);

const n = 20;

const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')

// get artist details by knowing artist id
function artistDetails(){
    let artInput = document.getElementById("by-artist");       // get input from user
    const list = document.getElementById('artist-list');
    const header = document.getElementById('h-art');
    clear(list);
    clear(header);
    fetch(`/api/artists/${artInput.value}`)
    .then(res => res.json())
    .then(data => {
            header.append(document.createTextNode(`Artist results for: ${artInput.value}`))
            const item = document.createElement('li')
            const h2 = document.createElement('h2');
            h2.appendChild(document.createTextNode(`${data.artist_id}. Name: ${data.artist_name} `));
            item.appendChild(h2);
            item.appendChild(document.createTextNode(`Contact: ${data.artist_handle} \n`));
            item.appendChild(document.createTextNode(`Members: ${data.artist_members}\n`));
            var a = document.createElement('a');
            a.href = (`${data.artist_website}`);
            a.title = (`${data.artist_website}`);
            a.append(document.createTextNode(`${data.artist_website}\n`));
            item.appendChild(document.createTextNode(`Website: `));
            item.appendChild(a);
            item.appendChild(document.createTextNode(`Date created: ${data.artist_date_created}\n`));
            item.appendChild(document.createTextNode(`Artist Tags: ${data.tags}\n`));
            item.classList.add("box")
            list.appendChild(item);
    })  
    .catch(function(err){
        header.append(document.createTextNode(`No results found. Please try again`))
    });       
}

// get list of artists by searching by name
function getArtistList(sortProperty){
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
        // compare input to fetched artists
        for (i = 0; i < data.length; i++) {
            // check if the input matches the inner text or text content
          value = data[i].artist_name; 
          // if the input matches an artist name exactly, move it to the top of the array
          if (value.toLowerCase().indexOf(artInput.value.toLowerCase()) > -1) {
            results[i] = data[i];    
          } 
        }       
        header.append(document.createTextNode(`Artist results for: ${artInput.value}`))
        results.sort(dynamicSort(sortProperty));
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.artist_id}. ${e.artist_name}`));
            item.classList.add("box")
            list.appendChild(item);
        });
    })   
}

// to get track details from id
function trackDetails(){
    let traInput = document.getElementById("by-track-id");       // get input from user
    const list = document.getElementById('track-list');
    const header = document.getElementById('h-track');
    clear(list);
    clear(header);
    if((traInput.value === "")){
        header.append(document.createTextNode(`Please enter a search value`))
    }else
    fetch(`/api/tracks/${traInput.value}`)
    .then(res => res.json())
    .then(data => {
        header.append(document.createTextNode(`Track result for id number ${traInput.value}`));
        // results.forEach(e => {
            var track_g = data.track_genres;
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
            h3.appendChild(document.createTextNode(`${data.track_id}. ${data.track_title} (Track number: ${data.track_number})`));
            item.appendChild(h3);
            item.appendChild(document.createTextNode(`Album: ${data.album_id}. ${data.album_title}\n`));
            item.appendChild(document.createTextNode(`Artist: ${data.artist_id}. ${data.artist_name}\n`));
            item.appendChild(document.createTextNode(`Tags: ${data.tags.replace(/[\[\]']+/g,'')}\n`));   
            item.appendChild(document.createTextNode(`Track date created: ${data.track_date_created} \nTrack date recorded: ${data.track_date_recorded} \n`));
            item.appendChild(document.createTextNode(`Track length: ${data.track_duration}\n`));
            item.appendChild(document.createTextNode(`Genres: ${g_string}\n`));        
            item.classList.add("box")
            list.appendChild(item);
    })        
    .catch(function(err){
        header.append(document.createTextNode(`No results found. Please try again`));
    });         
}

// to get a list of tracks by searching by album title or by album name
function getTrackList(sortProperty){
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
        // compare input to fetched tracks
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
        results.sort(dynamicSort(sortProperty));
        header.append(document.createTextNode(`Top ${n} track results for:  ${traInput.value}`))
        results.forEach(e => {
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${e.track_id}. ${e.track_title} [${e.track_duration}] (Album: ${e.album_title})`));
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

let lists = [];

// post to create new playlist
function addPlaylist(){
    let inputName = document.getElementById("new-playlist-name");
    if(lists.some(l => l === inputName.value.toLowerCase())){
        alert('This playlist already exists, please enter a unique name.')
        console.log(lists)
        }else{
      // // post to create new playlist
      fetch(`/api/playlists/${inputName.value}`, {
        method: "POST", 
        headers:{
            "Content-type": "application/json",
        },
        body: JSON.stringify({name: inputName.value, trackID: ""})
    })
    .then((res) => {
        if(res.ok){
        res.json();
        }else{
            console.log("Unsuccessful HTTP request: Error" + res.status);
        }
            return res;
        })
    .then(data => {
        const list = document.getElementById('playlist-names');
        const item = document.createElement('li')
        
        lists.push(inputName.value);
        item.appendChild(document.createTextNode(`${inputName.value}`));
        item.classList.add("box");
        item.setAttribute('id', `${inputName.value}`);
        item.addEventListener("click", function(e){
            viewPlaylist(e.target.id)});
        
        list.appendChild(item);   

        })
    .catch(err => console.log(err))

    }
    
}

// // put to add tracks to playlist
// function playlistTracks(){
//      // put fetch() to change tracks??
//      fetch('/api/playlists/help', {
//         method: "PUT", 
//         headers:{
//             "Content-type": "application/json",
//         },
//         body: JSON.stringify({id: "7" , name:"help"})
//     })
//     .then((res) => {
//         if(res.ok){
//         res.json();
//         }else{
//             console.log("Unsuccessful HTTP request");
//         }
//             return res;
//         })
//     .then(data => {console.log(data)})
//     .catch(err => console.log(err))
// }

let pTracks = [];
const trackIds = [];
let info = [];
    var totalLength = [];
// to add songs to a playlist
function editPlaylist(){
    const h = document.createElement('h2');
    const div = document.createElement('div');
    const list = document.getElementById("tracks-play");
    const playlistName = prompt("The playlist to edit", "Playlist name");
    totalLength = [];
    clear(div);
    h.appendChild(document.createTextNode("Playlist Tracks:"));
    div.appendChild(h);
    if(!lists.some(e => e.toLowerCase() === playlistName.toLowerCase())){
       alert("No such playlist exists. Please try again.")
    }else{ let playlistTracks = prompt("Enter the track ids to add to the playlist: seperated by commas");
        pTracks = playlistTracks.split(',');
        pTracks.forEach(e=>{
            fetch(`/api/tracks/${e}`)
            .then(res => res.json())
            .then(data => {
                trackIds.push(`${data.track_id}`);
                const tracksIn = JSON.stringify(trackIds);
            // // post to create new playlist
            fetch(`/api/playlists/${playlistName}`, {
             method: "POST", 
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify({name:`${playlistName}`, trackID: `${tracksIn}`, length:totalLength })
            })
            .then((res) => {
                if(res.ok){
                res.json();
                }else{
                    console.log("Unsuccessful HTTP request: Error" + res.status);
                }
                    return res;
                })
.           then(data => {

                })
                const item = document.createElement('li')      
                totalLength.push(data.track_duration);
                console.log(totalLength);
                item.appendChild(document.createTextNode(`${data.track_id}. ${data.track_title} by Artist: ${data.artist_id} (${data.track_duration})`));
                item.classList.add("box")
                div.setAttribute('id', `t${playlistName}`)
                div.classList.add('hide');
                div.appendChild(item);
                list.appendChild(div);
                console.log(totalLength);
            })        
            .catch(err => console.log(err));   
       })

    }
    let sum = totalLength.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
    });
    console.log(sum);
}

 
// to view the tracks in a playlist
function viewPlaylist(selected){
    const playlist_div = document.getElementById(`t${selected}`);
    playlist_div.classList.toggle('hide');
    // fetch(`/api/playlists/${selected}`)
    // .then(res => res.json())
    // .then(data => {
    //     var playlistTracks = JSON.parse(data.trackID);
    //     console.log(`${data.name}. Tracks in playlist: ${playlistTracks}`);

    //     playlistTracks.forEach(e => {
    //         console.log(e);
    //         fetch(`/api/tracks/${e}`)
    //         .then((res) => {
    //             if(res.ok){
    //             res.json();
    //             }else{
    //                 console.log("Track does not exist");
    //             }
    //                 return res;
    //             })
    //         .then(data => {
    //             console.log(data)
    //         })
    //         .catch(err => console.log(err))
    //     }

    //     );
    // })        
    // .catch(function(err){
    //     console.log(err);
    // });       
}

function deletePlaylist(){
    const playlistName = prompt("The playlist to Delete", "Playlist name");
    if(!lists.some(e => e.toLowerCase() === playlistName.toLowerCase()) && (playlistName != "")){
       alert("No such playlist exists. Please try again.")
    }else{ 
        // to delete the playlist
        fetch(`/api/playlists/${playlistName}`, {
            method: "DELETE", 
            headers:{
                "Content-type": "application/json",
            },
        })
        .then((res) => {
            if(res.ok){
            res.json();
            }else{
                console.log("Unsuccessful HTTP request: Error " + res.status);
            }
                return res;
            })
        .then(data => {
            clear(document.getElementById(playlistName).parentElement);
            console.log("deleted");
            lists.pop(playlistName);
            })
        .catch(err => console.log(err))

    }
}




