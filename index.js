// express
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

// to parse the csv files
const csv = require('csv-parser');
const fs = require('fs');
const genres = []; 
const albums = [];
const artists = [];
const tracks = [];

// read genres csv file
fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv({}))
    .on('data', (data) => genres.push(data))
    .on('end', () => {
        console.log(genres);
    });
// read album csv file
fs.createReadStream('lab3-data/raw_albums.csv')
    .pipe(csv({}))
    .on('data', (data) => albums.push(data))
    .on('end', () => {
        console.log(albums);
    });
// read artist csv file
fs.createReadStream('lab3-data/raw_artists.csv')
    .pipe(csv({}))
    .on('data', (data) => artists.push(data))
    .on('end', () => {
        console.log(artists);
    });
// read track csv file
fs.createReadStream('lab3-data/raw_tracks.csv')
    .pipe(csv({}))
    .on('data', (data) => tracks.push(data))
    .on('end', () => {
        console.log(tracks);
    });

const parts = [
    {id:100, name:'Belt', colour:'brown', stock:0},
    {id:101, name:'Clip', colour:'brown', stock:0},
    {id:102, name:'Belt', colour:'red', stock:0}, 
    {id:103, name:'Hat', colour:'purple', stock:0}
];

// set up front-end server using static 
app.use('/', express.static('static'));

// settup middleware to do console logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next(); // continue
})

// parse data in body as JSOn
router.use(express.json())

// get list of genres
router.get('/', (req, res) => {
    res.send(genres);
});

// get details of a given genre
router.get('/:genre_id', (req, res) =>{
    // string 
    const id = req.params.genre_id;
    // search genres array for if type and content of parameter matches array id
    const genre = genres.find(g => g.id === parseInt(id));
    if(genre){
        res.send(genre);
    } else{
        res.status(404).send(`Genre ${id} was not found :(`)
    }
});

// to create/replace genre data given a genre id
router.put('/:id', (req, res) =>{
    const newGenre = req.body;
    console.log("Genre: ", newGenre);

    newGenre.id = parseInt(req.params.id);

    // replace the old part with a new part
    const genre = genres.findIndex(g => g.id === newGenre.id);
    // if genre is not found
    if(genre < 0){
        console.log('Creating new genre');
        genres.push(newGenre);
    } else{
        console.log("Modifying genre ", req.params.id);
        genres[genre] = newGenre;
    }
    res.send(newGenre);
}) 

// // to change genre parent
// router.post('/:id', (req, res) =>{
//     const newGenre = req.body;
//     console.log("Genre: ", newGenre);

//     // find genre
//     const genre = genres.findIndex(g => g.id === parseInt(req.params.id));
//     // if not found
//     if(genre < 0){
//         res.status(404).send(`Genre ${req.params.id} not found`)
//     } else{
//         console.log("Changing parent for ", req.params.id);
//         parts[part].stock += parseInt(req.body.stock);  // assuming stock exists
//         res.send(newPart);
//     }
// });

// install the router at api/genres
app.use('/api/genres', router);
// install the router at api/albums
app.use('/api/albums', router);
// install the router at api/tracks
app.use('/api/tracks', router);
// install the router at api/artists
app.use('/api/artists', router);

// start app
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
