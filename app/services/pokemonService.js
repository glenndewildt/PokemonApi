/**
 * Created by Glenn on 22-3-2017.
 */
/* A Factory Implemented as a Singleton */
var PokemonService = require('./pokemonService');

module.exports = {
    getRedWidget: function getRedWidget() {
        var widget = new Widget(42, true);
        widget.paintPartA('red');
        widget.paintPartB('red');
        widget.paintPartC('red');
        return widget;
    },
    getBlueWidget: function getBlueWidget() {
        // ...
    }
}