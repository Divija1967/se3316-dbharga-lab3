// express
const express = require('express');
const app = express();
const port = 3000;
const routerGen = express.Router();
const routerArt = express.Router();
const routerAlb = express.Router();
const routerTra = express.Router();

// to parse the csv files
const csv = require('csv-parser');
const fs = require('fs');
// empty arrays to hold the parsed arrays
const genres = []; 
const albums = [];
const artists = [];
const tracks = [];

// read genres csv file
fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv({}))
    .on('data', (data) => genres.push(data));
    // .on('end', () => {
    //     console.log(genres);
    // });
// read album csv file
fs.createReadStream('lab3-data/raw_albums.csv')
    .pipe(csv({}))
    .on('data', (data) => albums.push(data));
    // .on('end', () => {
    //     console.log(albums);
    // });
// read artist csv file
fs.createReadStream('lab3-data/raw_artists.csv')
    .pipe(csv({}))
    .on('data', (data) => artists.push(data))
    // .on('end', () => {
    //     console.log(artists);
    // });
// read track csv file
fs.createReadStream('lab3-data/raw_tracks.csv')
    .pipe(csv({}))
    .on('data', (data) => tracks.push(data));
    // .on('end', () => {
    //     console.log(tracks);
    // });


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


// get list of genres 
routerGen.get('/', (req, res, next) => {
    res.send(genres);
    next();
});

// get list of artists 
routerArt.get('/', (req, res, next) => {
    res.send(artists);
    next();
});

// get list of albums 
routerAlb.get('/', (req, res, next) => {
    res.send(albums);
    next();
});

// get list of tracks 
routerTra.get('/', (req, res, next) => {
    res.send(tracks);
    next();
});

// get details of a given genre
routerGen.get('/:genre_id', (req, res) =>{
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
routerArt.get('/:artist_id', (req, res) =>{
    // string     
    const art_id = req.params.artist_id;
    // search genres array to see if type and content of parameter matches array id
    const artist = artists.find(g => g.artist_id === art_id);
    if(artist){
        res.send(artist);
    } else{
        res.status(404).send(`Genre ${art_id} was not found :(`)
    }
});

// get details of a given genre
routerArt.get('/:album_id', (req, res) =>{
    // string     
    const alb_id = req.params.album_id;
    // search genres array to see if type and content of parameter matches array id
    const album = albums.find(g => g.album_id === alb_id);
    if(album){
        res.send(album);
    } else{
        res.status(404).send(`Genre ${alb_id} was not found :(`)
    }
});

// get details of a given track
routerTra.get('/:track_id', (req, res) =>{
    // string     
    const tra_id = req.params.track_id;
    // search genres array to see if type and content of parameter matches array id
    const track = tracks.find(g => g.track_id === tra_id);
    if(track){
        res.send(track);
    } else{
        res.status(404).send(`Track ${tra_id} was not found :(`)
    }
});


// // to create/replace genre data given a genre id
// router.put('/:genre_id', (req, res) =>{
//     const newGenre = req.body;
//     console.log("Genre: ", newGenre);

//     newGenre.genre_id = parseInt(req.params.genre_id);

//     // replace the old part with a new part
//     const genre = genres.findIndex(g => g.genre_id === newGenre.id);
//     // if genre is not found
//     if(genre < 0){
//         console.log('Creating new genre');
//         genres.push(newGenre);
//     } else{
//         console.log("Modifying genre ", req.params.genre_id);
//         genres[genre] = newGenre;
//     }
//     res.send(newGenre);
// }) 

// // to change parts stock
// router.post('/:id', (req, res) =>{
//     const newPart = req.body;
//     console.log("Part: ", newPart);

//     // find part
//     const part = parts.findIndex(g => g.id === parseInt(req.params.id));
//     // if not found
//     if(part < 0){
//         res.status(404).send(`Part ${req.params.id} not found`)
//     } else{
//         console.log("Changing parent for ", req.params.id);
//         parts[part].stock += parseInt(req.body.stock);  // assuming stock exists
//         res.send(newPart);
//     }
// });

// install the router at api/genres
app.use('/api/genres', routerGen);
// install the router at api/albums
app.use('/api/albums', routerAlb);
// install the router at api/tracks
app.use('/api/tracks', routerTra);
// install the router at api/artists
app.use('/api/artists', routerArt);

// start app
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
