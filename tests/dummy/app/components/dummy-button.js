import Ember from 'ember';
import streamEnabled from 'ember-stream/mixins/stream-enabled';

const Rx = window.Rx;

export default Ember.Component.extend( streamEnabled, {

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

    parentStreamName: null,

    // -------------------------------------------------------------------------
    // Observers

    setupStreams: Ember.on(
        'didInsertElement',
        function() {
            const streamService = this.get( 'streamService' );
            const parentStreamName = this.get( 'parentStreamName' );

            const clickStream = Rx.Observable.fromEvent( this.$()[ 0 ], 'click' );

            clickStream.subscribe( ( event ) => {
                streamService.send( parentStreamName, 'click', event );
            });

            clickStream.timeInterval()
                .filter( x => x.interval < 250 )
                .subscribe( ( event ) => {
                    streamService.send( parentStreamName, 'doubleClick', event );
                });
        }
    )

    // -------------------------------------------------------------------------
    // Methods

});
