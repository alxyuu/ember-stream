import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor( 'service:stream', 'Unit | Service | stream' );

test( 'Rx is available', function( assert ) {
    const streamService = this.subject();

    assert.ok(
        streamService.Rx,
        'Rx is a valid property on the service'
    );
});

test( 'find() creates and returns a promise', function( assert ) {
    const streamService = this.subject();

    assert.ok(
        streamService.find( 'test' ) instanceof Ember.RSVP.Promise,
        'Returned value is a Promise'
    );
});

test( 'create() creates and registers an observable stream', function( assert ) {
    assert.expect( 2 );

    const streamService = this.subject();
    const stream = streamService.create( 'test', () => {} );

    assert.ok(
        stream instanceof streamService.Rx.AnonymousObservable,
        'Created object is an observable'
    );

    streamService.find( 'test' ).then( ( registeredStream ) => {
        assert.ok(
            registeredStream === stream,
            'Received properly looked-up registered stream'
        );
    });
});

test( 'Registering and finding observables are supported', function( assert ) {
    assert.expect( 2 );

    const streamService = this.subject();
    const observable = window.Rx.Observable.create( () => {} );

    assert.ok(
        streamService.register( 'test', observable ),
        'Registered stream successfully'
    );

    streamService.find( 'test' ).then( ( stream ) => {
        assert.ok(
            stream === observable,
            'Stream was looked up successfully'
        );
    });
});

test( 'subscribe() properly subscribes handlers to a stream', function( assert ) {
    const streamService = this.subject();

    streamService.create( 'test', ( observer ) => {
        observer.onNext( true );
    });

    streamService.subscribe( 'test', ( okay ) => {
        assert.ok( okay, 'Observer triggered successfully' );
    });
});
