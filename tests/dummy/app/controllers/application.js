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

            const timeoutStream = window.Rx.Observable.create( ( observer ) => {
                setTimeout( () => {
                    observer.onNext( Date.now() );
                    observer.onCompleted();
                }, 5000 );
            });

            const subscription = timeoutStream.subscribe(
                ( timestamp ) => { console.log( timestamp ); },
                ( error ) => { console.error( error ); },
                () => { console.log( 'Completed!' ); }
            );

            console.log( 'Setup', Date.now() );

            /*
            streamService.subscribeTo( 'clickStream', ( event ) => {
                console.log( 'clickStream', event, Date.now() );
                this.set( 'clickTimestamp', Date.now() );
            });
            // */

            streamService.subscribeTo( 'clickStream', window.Rx.Observer.create(
                function( event ) {
                    console.log( 'clickStream', event, Date.now() );
                },
                function( error ) {
                    console.log( 'Error!', error );
                }
            ));

            streamService.subscribeTo( 'doubleClickStream', () => {
                this.set( 'doubleClickTimestamp', Date.now() );
            });
        }
    )

    // -------------------------------------------------------------------------
    // Methods

});
