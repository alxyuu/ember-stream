import Ember from 'ember';
import StreamEnabledMixin from '../../../mixins/stream-enabled';
import { module, test } from 'qunit';

module( 'Unit | Mixin | stream enabled', {
    needs: [
        'service:stream'
    ]
});

test( 'Stream service is bound', function( assert ) {
    const StreamEnabledObject = Ember.Object.extend( StreamEnabledMixin );
    const subject = StreamEnabledObject.create();

    assert.ok(
        subject.get( 'streamService' ), // ERROR!
        'streamService property is set'
    );
});
