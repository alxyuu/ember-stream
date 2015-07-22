import Ember from 'ember';

export default Ember.Component.extend({

    // -------------------------------------------------------------------------
    // Dependencies

    // -------------------------------------------------------------------------
    // Attributes

    tagName: 'button',

    // -------------------------------------------------------------------------
    // Actions

    // -------------------------------------------------------------------------
    // Events

    click( event ) {
        this.sendAction();
    },

    // -------------------------------------------------------------------------
    // Properties

    streamService: Ember.inject.service( 'stream' ),

    // -------------------------------------------------------------------------
    // Observers

    setupStreams: Ember.on(
        'init',
        function() {
            const streamService = this.get( 'streamService' );

            const clickStream = window.Rx.Observable.from( this.click );
            streamService.register({ clickStream });

            const doubleClickStream = clickStream
                .selectMany( ( x, i ) => {
                    console.log( x, i );
                });
            // streamService.register({ clickStream, doubleClickStream });
        }
    )

    // -------------------------------------------------------------------------
    // Methods

});
