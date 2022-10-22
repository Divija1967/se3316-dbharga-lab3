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

// get list of parts
router.get('/', (req, res) => {
    res.send(parts);
});

// get details of a given part
router.get('/:part_id', (req, res) =>{
    // string 
    const id = req.params.part_id;
    // search parts array for if type and content of parameter matches array id
    const part = parts.find(p => p.id === parseInt(id));
    if(part){
        res.send(part);
    } else{
        res.status(404).send(`Part ${id} was not found :(`)
    }
});

// to create/replace part data given a part id
router.put('/:id', (req, res) =>{
    const newPart = req.body;
    console.log("Part: ", newPart);

    newPart.id = parseInt(req.params.id);

    // replace the old part with a new part
    const part = parts.findIndex(p => p.id === newPart.id);
    // if part is not found
    if(part < 0){
        console.log('Creating new part');
        parts.push(newPart);
    } else{
        console.log("Modifying part ", req.params.id);
        parts[part] = newPart;
    }
    res.send(newPart);
}) 

// to update
router.post('/:id', (req, res) =>{
    const newPart = req.body;
    console.log("Part: ", newPart);

    // find part
    const part = parts.findIndex(p => p.id === parseInt(req.params.id));
    // if not found
    if(part < 0){
        res.status(404).send(`Part ${req.params.id} not found`)
    } else{
        console.log("Changing stock for ", req.params.id);
        parts[part].stock += parseInt(req.body.stock);  // assuming stock exists
        res.send(newPart);
    }
});

// install the router at api/parts
app.use('/api/parts', router);

// start app
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
