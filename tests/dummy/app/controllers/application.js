import Ember from 'ember';

export default Ember.Controller.extend({

    // -------------------------------------------------------------------------
    // Dependencies

    // -------------------------------------------------------------------------
    // Attributes

    // -------------------------------------------------------------------------
    // Actions

    // -------------------------------------------------------------------------
    // Events

    // -------------------------------------------------------------------------
    // Properties

    clickTimestamp: null,

    doubleClickTimestamp: null,

    streamService: Ember.inject.service( 'stream' ),

    // -------------------------------------------------------------------------
    // Observers

    initialize: Ember.on(
        'init',
        function() {
            const streamService = this.get( 'streamService' );

            streamService.subscribeTo( 'clickStream', () => {
                this.set( 'clickTimestamp', Date.now() );
            });

            streamService.subscribeTo( 'doubleClickStream', () => {
                this.set( 'doubleClickTimestamp', Date.now() );
            });
        }
    )

    // -------------------------------------------------------------------------
    // Methods

});
