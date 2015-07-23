/* jshint node: true */
'use strict';

module.exports = {
    name: 'ember-stream',

    included: function( app ) {
        this._super.included( app );

        app.import({
            development: 'bower_components/rxjs/dist/rx.all.js',
            production: 'bower_components/rxjs/dist/rx.all.min.js'
        });
    }
};
