import Ember from 'ember';

export default Ember.Controller.extend({

    // -------------------------------------------------------------------------
    // Dependencies

    needs: [
        'index'
    ],

    // -------------------------------------------------------------------------
    // Attributes

    // -------------------------------------------------------------------------
    // Actions

    // -------------------------------------------------------------------------
    // Events

    // -------------------------------------------------------------------------
    // Properties

    streamService: Ember.inject.service( 'stream' ),

    // -------------------------------------------------------------------------
    // Observers

    initialize: Ember.on(
        'init',
        function() {
            const streamService = this.get( 'streamService' );

            streamService.subscribe( 'click', () => {
                this.get( 'controllers.index' ).set( 'clickTimestamp', Date.now() );
            });

            streamService.subscribe( 'doubleClick', () => {
                this.get( 'controllers.index' ).set( 'doubleClickTimestamp', Date.now() );
            });
        }
    )

    // -------------------------------------------------------------------------
    // Methods

});
