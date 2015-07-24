import Ember from 'ember';

const streams = {};
const subscriptions = {};

/**
 * A service used to register, lookup, and subscribe indirectly to Rx.Observable
 *
 * @module
 * @augments ember/Service
 */
export default Ember.Service.extend({

    /**
     * An alias to the ReactiveX library itself
     *
     * @type {Object}
     */
    Rx: window.Rx,

    /**
     * Create an observable stream from a function definition
     *
     * @function
     * @param {Function} func - The function to create the stream from
     * @returns {rx/Observable} - The created observable stream
     */
    createStream( func ) {
        return this.Rx.Observable.create( func );
    },

    /**
     * Lookup an observable stream by its registered name
     *
     * @function
     * @param {String} streamName - The name of the stream to attempt lookup on
     * @returns {?rx/Observable} - The Rx.Observable object that is registered
     *          to the supplied streamName
     */
    findStream( streamName ) {
        for ( const name of Object.keys( streams ) ) {
            if ( name === streamName ) {
                return streams[ name ];
            }
        }

        return null;
    },

    /**
     * Register an observable stream or streams to the supplied name(s)
     *
     * @function
     * @param {String} streamName - The name to register an observable stream to
     * @param {rx/Observable} stream - A single observable object
     * @returns {Boolean} - True unless an error is encountered
     */
    registerStream( streamName, stream ) {
        if ( streams.hasOwnProperty( streamName ) ) {
            Ember.Logger.warn( `Stream "${streamName}" already exists` );
        }

        streams[ streamName ] = stream;

        // Set up subscriptions for observers waiting for this named stream
        if ( subscriptions.hasOwnProperty( streamName ) ) {
            for ( const subscription of subscriptions[ streamName ] ) {
                stream.subscribe.apply( stream, subscription.observer );
                subscription.deferred.resolve();
            }

            delete subscriptions[ streamName ];
        }

        return true;
    },

    /**
     * Register multiple observable streams by passing in a key-value hash
     *
     * @function
     * @param {Object} streamsObject - A key-value hash, where each key is the
     *        name to register a stream to, and each value is the stream object
     * @returns {Boolean} - True unless an error is encountered
     */
    registerStreams( streamsObject ) {
        const streamsObject = streamsObjectOrName;

        for ( const name of Object.keys( streamsObject ) ) {
            const okay = this.registerStream( name, streamsObject[ name ] );

            if ( !okay ) {
                return false;
            }
        }

        return true;
    },

    /**
     * Remove a registered stream reference
     *
     * @function
     * @param {String} streamName - The name of the stream to unregister
     * @returns {Boolean} - True unless an error is encountered
     */
    unregisterStream( streamName ) {
        if ( streams.hasOwnProperty( streamName ) ) {
            delete streams[ streamName ];
        } else {
            Ember.Logger.warn( `No stream named "${streamName}" found` );
        }

        return true;
    },

    /**
     * Remove multiple registered streams
     *
     * @function
     * @param {String[]} streamNames - The names of the streams to unregister
     * @returns {Boolean} - True unless an error is encountered
     */
    unregisterStreams( streamNames ) {
        for ( const streamName of streamNames ) {
            if ( !this.unregisterStream( streamName ) ) {
                return false;
            }
        }

        return true;
    },

    /**
     * Attempts to subscribe an observer (or series of callbacks) to an
     * observable stream
     *
     * If the stream is registered, a subscription object is returned from the
     * internal observable's subscribe() call.
     *
     * If the stream is not registered, the subscription is deferred until the
     * stream is registered, and an RSVP.deferred object is returned.
     *
     * @function
     * @param {String} streamName - The name of the stream to subscribe to
     * @param {rx/Observer|Function} observerOrOnNext - Either an Rx.Observer
     *        object, or a callback function mapping to the onNext hook
     * @param {Function} [onError] - A separate callback that is triggered when
     *        the onError hook is fired from the observable (only valid if the
     *        first argument is a Function)
     * @param {Function} [onCompleted] - A separate callback that is triggered
     *        when the onCompleted hook is fired from the observable (only valid
     *        if the first argument is a Function)
     * @returns {Object} - Either a subscription object or a deferred object
     */
    subscribeTo( streamName, observerOrOnNext, onError, onCompleted ) {
        const stream = this.findStream( streamName );

        if ( stream ) {
            return streams[ streamName ].subscribe(
                observerOrOnNext, onError, onCompleted
            );
        }

        if ( !subscriptions.hasOwnProperty( streamName ) ) {
            subscriptions[ streamName ] = [];
        }

        const deferred = Ember.RSVP.defer();

        subscriptions[ streamName ].push({
            deferred,
            observer: [ observerOrOnNext, onError, onCompleted ]
        });

        return deferred.promise;
    }

});
