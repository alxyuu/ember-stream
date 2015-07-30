import Ember from 'ember';

const Rx = window.Rx;

/**
 * A service used to register, lookup, and subscribe indirectly to observables,
 * or "streams", and interact with their observing subjects
 *
 * @module
 * @augments ember/Service
 */
export default Ember.Service.extend({

    /**
     * Create a new stream with the supplied `streamName`
     *
     * @function
     * @param {String} streamName - What to register the stream as
     * @returns {rx/Subject} - An observable/observer subject
     */
    create( streamName ) {
        const stream = {
            name: streamName,

            on: function( actionName, handler ) {
                this.subject
                    .filter( value => actionName === value.action )
                    .map( value => value.data )
                    .subscribe( handler );
            },

            subject: new Rx.Subject()
        };

        stream.subject.subscribeOnCompleted( () => {
            stream.subject.dispose();
            Ember.set( this.get( 'streams' ), streamName, null );
        });

        Ember.set( this.get( 'streams' ), streamName, stream );

        return stream;
    },

    /**
     * Send the stream named `streamName' an `actionName` and some `data`
     *
     * If a stream with `streamName` is not registered, nothing happens.
     *
     * @function
     * @param {String} streamName - The name of the stream to send data to
     * @param {String} action - A string action name that the stream should
     *        be expected to handle
     * @param {*} [data] - Any additional data to send to the stream
     * @return {Boolean} - True if the action was sent to the stream
     */
    send( streamName, action, data ) {
        const stream = Ember.get( this.get( 'streams' ), streamName );

        if ( !stream ) {
            return false;
        }

        stream.subject.onNext({ action, data });

        return true;
    },

    /**
     * A key-value hash of stream subjects
     *
     * @private
     * @type {?Object}
     */
    streams: {}

});
