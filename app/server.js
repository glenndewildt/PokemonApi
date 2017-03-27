/**
 * Created by Glenn on 21-3-2017.
 */
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var https = require('https');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
//mongoose setup
var mongoose   = require('mongoose');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

//Our models
var Pokemon     = require('./models/pokemon');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------



router.route('/pokemons')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var pokemon = new Pokemon();      // create a new instance of the Bear model
        pokemon.name = req.body.name;  // set the bears name (comes from the request)

        pokemon.longatude = 10;
        pokemon.latetude = 12;

        // save the bear and check for errors
        pokemon.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Pokemon created!' });
        });

    })
    //gets all pokemons from the PokemonApi
.get(function(req, res) {
    return https.get({
        host: 'pokeapi.co',
        path: '/api/v2/pokemon/',
        method: 'GET'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
            console.log(d);
        });
        response.on('end', function () {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            res.json(body);
        });
    });
});

//routes for pokemons on the mapp
router.route('/pokemons/pokemonLocations')
//gets all pokemons from the PokemonApi
    .get(function(req, res) {
        Pokemon.find(function (err, pokemons) {
            if (err)
                res.send(err);

            res.json(pokemons);
        })
    })
    //post a new pokemon with location
    .post(function(req, res) {

    var pokemon = new Pokemon();      // create a new instance of the Bear model
    pokemon.name = req.body.name;  // set the bears name (comes from the request)

    pokemon.longatude = req.body.longatude;
    pokemon.latetude = req.body.latetude;

    // save the bear and check for errors
    pokemon.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Pokemon created!' });
    });

});


// on routes that end in /pokemon/:pokemon_id
// ----------------------------------------------------
router.route('/pokemons/:pokemon_id')
// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
         https.get({
            host: 'pokeapi.co',
            path: '/api/v2/pokemon/'+req.params.pokemon_id,
            method: 'GET'
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function (d) {
                body += d;

            });
            response.on('end', function () {

                // Data reception is done, do whatever with it!
                console.log(req.params.pokemon_id);
                console.log(body);

                try {
                    var parsed = JSON.parse(body);
                    res.json(parsed);
                } catch(e) {
                    console.log('malformed request', body);
                    return res.status(400).send('malformed request: ' + body);
                }

            });
        });

    })


// update the pokemon with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
.put(function(req, res) {

    // use our bear model to find the bear we want
    Pokemon.findById(req.params.pokemon_id, function(err, pokemon) {

        if (err)
            res.send(err);

        pokemon.name = req.body.name;  // update the bears info

        // save the bear
        pokemon.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Pokemon updated!' });
        });

    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Pokemon.remove({
            _id: req.params.pokemon_id
        }, function(err, pokemon) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
    //closing tag /pokemon/:pokemon_id
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);