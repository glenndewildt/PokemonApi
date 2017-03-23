/**
 * Created by Glenn on 21-3-2017.
 */
// app/models/bear.js

//local variable
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var http = require('http');


var PokemonSchema   = new Schema({
    name: String,


});




function getPokemons() {

    return http.get({
        host: 'http://pokeapi.co/api/v2',
        path: '/pokemon'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
        });
    });
}


module.exports = mongoose.model('Pokemon', PokemonSchema);