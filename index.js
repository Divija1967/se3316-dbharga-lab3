const Joi = require('joi');   // for input validation
const express = require('express');     // express
const app = express();      
const bodyParser = require('body-parser');

const port = 3000;
const routerGen = express.Router();
const routerArt = express.Router();
const routerAlb = express.Router();
const routerTra = express.Router();

const routerList = express.Router();

// to parse the csv files
const csv = require('csv-parser');
const fs = require('fs');
// empty arrays to hold the parsed arrays
const genres = []; 
const albums = [];
const artists = [];
const tracks = [];
const playlists = [];

// read genres csv file
fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv({}))
    .on('data', (data) => genres.push(data));

// read album csv file
fs.createReadStream('lab3-data/raw_albums.csv')
    .pipe(csv({}))
    .on('data', (data) => albums.push(data));

// read artist csv file
fs.createReadStream('lab3-data/raw_artists.csv')
    .pipe(csv({}))
    .on('data', (data) => artists.push(data))

// read track csv file
fs.createReadStream('lab3-data/raw_tracks.csv')
    .pipe(csv({}))
    .on('data', (data) => tracks.push(data));

// set up front-end server using static 
app.use('/', express.static('static'));

// settup middleware to do console logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next(); // continue
})

// parse data in body as json
routerGen.use(express.json())
routerArt.use(express.json())
routerAlb.use(express.json());
routerTra.use(express.json());

// routerList.use(express.json());


// get list of genres 
routerGen.get('/', (req, res, next) => {
    const nGenres = genres.map((data) => {
        return {
            'genre_id' : data.genre_id,
            'parent' : data.parent,
            'title' : data.title
        }
    });
    res.send(nGenres);
    next();
});

// get list of artists 
routerArt.get('/', (req, res, next) => {
    const nArtists = artists.map((data) => {
        return {
            'artist_id' : data.artist_id,
            'artist_name' : data.artist_name,
            'artist_handle' : data.artist_handle,
            'artist_members' : data.artist_members,
            'artist_website' : data.artist_website,
            'artist_date_created' : data.artist_date_created,
            'artist_tags' : data.tags
        }
    });
    res.send(nArtists);
    next();
});

// get list of albums 
routerAlb.get('/', (req, res, next) => {
    res.send(albums);
    next();
});

// get list of tracks 
routerTra.get('/', (req, res, next) => {
    const nTracks = tracks.map((data) => {
        return {
            'track_id' : data.track_id,
            'track_title' : data.track_title,
            'track_number' : data.track_number,
            'album_id' : data.album_id,
            'album_title' : data.album_title,
            'artist_id' : data.artist_id,
            'artist_name' : data.artist_name,
            'tags' : data.tags,
            'track_date_created' : data.track_date_created,
            'track_date_recorded' : data.track_date_recorded,
            'track_duration' : data.track_duration,
            'track_genres' : data.track_genres,
        }
    });
    res.send(nTracks);
    next();
});

// get list of tracks 
routerList.get('/', (req, res, next) => {
    res.send(playlists);
    next();
});

// get details of a given genre
routerGen.get('/:genre_id([0-9]{1}|[0-9]{2}|[0-9]{3}|[0-9]{4}|[0-9]{5})', (req, res) =>{
    // string     
    const id = req.params.genre_id;
    // search genres array to see if type and content of parameter matches array id
    const genre = genres.find(g => g.genre_id === id);
    if(genre){
        res.send(genre);
    } else{
        res.status(404).send(`Genre ${id} was not found :(`)
    }
});

// get details of a given artist
routerArt.get('/:artist_id([0-9]{1}|[0-9]{2}|[0-9]{3}|[0-9]{4}|[0-9]{5})', (req, res) =>{
    // string     
    const art_id = req.params.artist_id;
    // search artists to see if type and content of parameter matches array id
    const artist = artists.find(g => g.artist_id === art_id);
    if(isNaN(parseInt(art_id))){
        res.status(400).send("Playlist ID must be a number")
        return;
    }
    
    if(artist){
        res.send(artist);
    } else{
        res.status(404).send(`Artist ${art_id} was not found :(`)
    }

});

// // get details of a given genre
// routerArt.get('/:album_id([0-9])', (req, res) =>{
//     // string     
//     const alb_id = req.params.album_id;
//     // search genres array to see if type and content of parameter matches array id
//     const album = albums.find(g => g.album_id === alb_id);
//     // if(isNaN(parseInt(alb_id))){
//     //     res.status(400).send("Album ID must be a number")
//     //     return;
//     // }
//     if(album){
//         res.send(album);
//     } else{
//         res.status(404).send(`Genre ${alb_id} was not found :(`)
//     }
// });

// get tracks from a given album
routerAlb.get('/name/:album_title([0-9a-zA-Z]+)', (req, res) =>{
    // string     
    const alb_nam = req.params.album_title;
    // search genres array to see if type and content of parameter matches array id
    const track = tracks.filter(g => g.album_title.toLowerCase().indexOf(alb_nam.toLowerCase()) > -1).slice(0,20);
    const nTracks = track.map((data) => {
        return {
            'track_id' : data.track_id,
            'track_title' : data.track_title,
            'track_number' : data.track_number,
            'album_id' : data.album_id,
            'album_title' : data.album_title,
            'artist_id' : data.artist_id,
            'artist_name' : data.artist_name,
            'tags' : data.tags,
            'track_date_created' : data.track_date_created,
            'track_date_recorded' : data.track_date_recorded,
            'track_duration' : data.track_duration,
            'track_genres' : data.track_genres,
        }
    });
    if(nTracks){
        res.send(nTracks);
    } else{
        res.status(404).send(`Track ${alb_nam} was not found :(`)
    }
});

// get details of a given track
routerTra.get('/:track_id([0-9]{1}|[0-9]{2}|[0-9]{3}|[0-9]{4}|[0-9]{5}|[0-9]{6})', (req, res) =>{
    // string     
    const tra_id = req.params.track_id;
    if(isNaN(parseInt(tra_id))){
        res.status(400).send("Track ID must be a number")
        return;
    }
    // search genres array to see if type and content of parameter matches array id
    const track = tracks.find(g => g.track_id === tra_id);
    if(track){
        res.send(track);
    } else{
        res.status(404).send(`Track ${tra_id} was not found :(`)
    }
});


// get track from track title or from album name
routerTra.get('/name/:track_title([0-9a-zA-Z]+)', (req, res) =>{
    const tra_nam = req.params.track_title;

    const track = tracks.filter(g => (g.track_title.toLowerCase().indexOf(tra_nam.toLowerCase()) > -1) || g.album_title.toLowerCase().indexOf(tra_nam.toLowerCase()) > -1).slice(0,11);

    const nTracks = track.map((data) => {
        return {
            'track_id' : data.track_id,
            'track_title' : data.track_title,
            'album_title' : data.album_title,
        }
    });
    if(nTracks){
        res.send(nTracks);
    } else{
        res.status(404).send(`Track ${tra_nam} was not found :(`)
    } 
});

// get details of a given track
routerList.get('/:name([0-9a-zA-Z]+)', (req, res) =>{
    // string     
    const id = req.params.name;
    // search genres array to see if type and content of parameter matches array id
    const list = playlists.find(g => g.name === id);
    if(list){
        res.send(list);
    } else{
        res.status(404).send(`Track ${id} was not found :(`)
    }
});

// to create/replace tracks data given a playlist
routerList.put('/:name', (req, res) =>{
    const newPlaylist = req.body;
    console.log("Playlist: ", newPlaylist);

    newPlaylist.name = req.params.name;
    if(!newPlaylist.name || newPlaylist.name.length > 20 || newPlaylist.name.length < 2){
        res.status(400).send("Playlist name must be between 2 and 20 characters")
        return;
    }

     const schema = Joi.object({
        name: Joi.string()
        .min(2)
        .max(20)
        // .regex(/^[a-zA-Z0-9]*$/),
        // trackID: Joi.string()
        // .regex(/^[a-zA-Z0-9]*$/),
    })
    const result = schema.validate(newPlaylist);
    // if(result.error){
    //     res.status(400).send("Playlist name must be between 2 and 20 characters")
    // }

    // replace the old part with a new part
    const list = playlists.findIndex(g => g.name === newPlaylist.name);
    // if genre is not found
    if(list < 0){
        console.log('Creating new playlist');
        playlists.push(newPlaylist);
    } else{
        console.log("Modifying playlist ", req.params.name);
        playlists[list] = newPlaylist;
    }
    res.send(newPlaylist);
}) 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routerList.post('/:name', (req, res) => {
    // We will be coding here
    const newPlaylist = req.body;

    newPlaylist.name = req.params.name;

    if(!newPlaylist.name || newPlaylist.name.length > 20 || newPlaylist.name.length < 2){
        res.status(400).send("Playlist name must be between 2 and 20 characters")
        return;
    }else{
    // replace the old part with a new part
    const list = playlists.findIndex(g => g.name === newPlaylist.name);
    
    // if playlist is not found, create it
    if(list < 0){
        console.log('Creating new playlist');
        playlists.push(newPlaylist);
    } else{
        // can only 
        res.status(400).send("Playlist exists. Try a new name or modify/delete the existing playlist");
        return;
    }
    res.send(newPlaylist);
}
});

// to delete a playlist
routerList.delete('/:name', (req, res) => {
    const playlistToDelete = req.body;
    console.log("Playlist: ", playlistToDelete);

    playlistToDelete.name = req.params.name;

    if(!playlistToDelete.name || playlistToDelete.name.length > 20 || playlistToDelete.name.length < 2){
        res.status(400).send("Playlist name must be between 2 and 20 characters")
        return;
    }else{
    // replace the old part with a new part
    const list = playlists.findIndex(g => g.name.toLowerCase() === playlistToDelete.name.toLowerCase());
    // if genre is not found
    if(list < 0){
        res.status(404).send(`Playlist was not found :(`)
    } else{
        console.log("Deleting playlist ", req.params.name);
        playlists.pop(playlistToDelete);
    }
    res.send(playlists);
}
});


// install the router at api/genres
app.use('/api/genres', routerGen);
// install the router at api/albums
app.use('/api/albums', routerAlb);
// install the router at api/tracks
app.use('/api/tracks', routerTra);
// install the router at api/artists
app.use('/api/artists', routerArt);
// install the router at /api/playlists
app.use('/api/playlists', routerList);

// start app
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
