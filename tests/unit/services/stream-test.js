import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const Rx = window.Rx;

moduleFor( 'service:stream', 'Unit | Service | stream' );

test( 'create() creates a stream object', function( assert ) {
    const streamService = this.subject();
    const streamName = 'test';
    const stream = streamService.create( streamName );

    assert.ok(
        'object' === Ember.typeOf( stream ),
        'Received an object'
    );

    assert.ok(
        'string' === Ember.typeOf( stream.name ),
        'stream.name is a string'
    );

    assert.equal(
        stream.name,
        streamName,
        'stream.name is the expected value'
    );

    assert.ok(
        'function' === Ember.typeOf( stream.on ),
        'stream.on is a function'
    );

    assert.ok(
        stream.subject instanceof Rx.Subject,
        'stream.subject is an instance of Rx.Subject'
    );
});

test( 'send() communicates with a targeted stream', function( assert ) {
    const streamService = this.subject();
    const streamName = 'test';
    const stream = streamService.create( streamName );
    const actionName = 'doSomething';

    stream.on( actionName, ( data ) => {
        assert.ok( data.okay, 'Received data from stream action successfully' );
    });

    streamService.send( streamName, actionName, { okay: true } );
});
