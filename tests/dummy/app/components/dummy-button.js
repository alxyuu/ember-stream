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

    // -------------------------------------------------------------------------
    // Properties

    streamService: Ember.inject.service( 'stream' ),

    // -------------------------------------------------------------------------
    // Observers

    setupStreams: Ember.on(
        'didInsertElement',
        function() {
            const streamService = this.get( 'streamService' );

            const clickStream = streamService.create( 'click', ( observer ) => {
                this.$().bind( 'click', ( event ) => {
                    observer.onNext( event );
                });
            });

            streamService.register(
                'doubleClick',
                clickStream
                    .timeInterval()
                    .filter( x => x.interval < 250 )
            );
        }
    )

    // -------------------------------------------------------------------------
    // Methods

});
