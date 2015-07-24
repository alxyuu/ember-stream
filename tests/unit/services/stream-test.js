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

test( 'createStream() creates an observable stream', function( assert ) {
    const streamService = this.subject();
    const stream = streamService.createStream();

    assert.ok(
        stream instanceof streamService.Rx.AnonymousObservable,
        'Created object is an observable'
    );
});

test( 'Registering, finding, and unregistering streams are supported', function( assert ) {
    const streamService = this.subject();
    const stream = streamService.createStream( () => {} );

    assert.ok(
        streamService.registerStream( 'test', stream ),
        'Registered stream successfully'
    );

    assert.equal(
        streamService.findStream( 'test' ),
        stream,
        'Stream was looked up successfully'
    );

    assert.ok(
        streamService.unregisterStream( 'test' ),
        'Stream was unregistered successfully'
    );
});

test( 'subscribeTo() properly subscribes an observer to a stream', function( assert ) {
    const streamService = this.subject();
    const stream = streamService.createStream( observer => {
        observer.onNext( true );
    });

    streamService.registerStream( 'test', stream );
    streamService.subscribeTo( 'test', okay => {
        assert.ok( okay, 'Observer triggered successfully' );
    });

    streamService.unregisterStream( 'test' );
});

test( 'Subscription properly deferred until stream is registered', function( assert ) {
    assert.expect( 2 );

    const streamService = this.subject();

    const testPromise = streamService.subscribeTo( 'test', okay => {
        assert.ok( okay, 'Observer triggered successfully' );
    });

    assert.ok(
        testPromise instanceof Ember.RSVP.Promise,
        'Received a Promise from subscribeTo call'
    );

    streamService.registerStream(
        'test',
        streamService.createStream( observer => {
            observer.onNext( true );
        })
    );

    streamService.unregisterStream( 'test' );
});
