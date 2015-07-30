import Ember from 'ember';
import streamEnabled from 'ember-stream/mixins/stream-enabled';

export default Ember.Controller.extend( streamEnabled, {

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

    streamName: 'index',

    // -------------------------------------------------------------------------
    // Observers

    setupTimestampUpdates: Ember.on(
        'init',
        function() {
            const stream = this.get( 'stream' );

            stream.on( 'click', () => {
                this.set( 'clickTimestamp', Date.now() );
            });

            stream.on( 'doubleClick', () => {
                this.set( 'doubleClickTimestamp', Date.now() );
            });
        }
    )


    // -------------------------------------------------------------------------
    // Methods

});
