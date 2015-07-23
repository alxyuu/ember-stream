import Ember from 'ember';

let streams = {};
let subscriptions = {};

/**
 * A service used to register, lookup, and subscribe indirectly to Rx.Observable
 *
 * @module
 * @augments ember/Service
 */
export default Ember.Service.extend({

    /**
     * Create an observable stream from a function definition
     *
     * @function
     * @param {Function} func - The function to create the stream from
     * @param {String} [name] - A name to register the stream to
     * @returns {rx/Observable} - The created observable stream
     */
    createStream( func, name ) {
        const stream = this.Rx.Observable.create( func );

        if ( name ) {
            this.registerStream( name, stream );
        }

        return stream;
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
     * @param {Object|String} streamsObjectOrName - Either an object containing
     *        key-value pairs of multiple stream definitions, or a single string
     *        used to register the `observable` name to
     * @param {rx/Observable} [observable] - A single observable object, if the
     *        first argument is a string
     * @returns {Boolean} - True unless an error is encountered
     */
    registerStream( streamsObjectOrName, observable ) {
        if ( 'string' === Ember.typeOf( streamsObjectOrName ) && observable ) {
            const streamName = streamsObjectOrName;

            if ( streams.hasOwnProperty( streamName ) ) {
                Ember.Logger.warn( `Stream "${streamName}" already exists` );
                return false;
            }

            streams[ streamName ] = observable;

            // Set up subscriptions for observers waiting for this named stream
            if ( subscriptions.hasOwnProperty( streamName ) ) {
                for ( const subscription of subscriptions[ streamName ] ) {
                    observable.subscribe.apply( observable, subscription );
                }

                delete subscriptions[ streamName ];
            }

            return true;
        }

        if ( 'object' === Ember.typeOf( streamsObjectOrName ) ) {
            const streamsObject = streamsObjectOrName;

            for ( const name of Object.keys( streamsObject ) ) {
                const okay = this.registerStream( name, streamsObject[ name ] );

                if ( !okay ) {
                    return false;
                }
            }

            return true;
        }

        return false;
    },

    /**
     * An alias to the ReactiveX library itself
     *
     * @type {Object}
     */
    Rx: window.Rx,

    /**
     * Attempts to subscribe an observer (or series of callbacks) to an
     * observable stream
     *
     * If the stream is not registered, the observer (or callbacks) are saved in
     * order to subscribe whenever the stream is property registered.
     *
     * @todo Return either a promise or the subscription object
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
     * @returns {undefined}
     */
    subscribeTo( streamName, observerOrOnNext, onError, onCompleted ) {
        const stream = this.findStream( streamName );

        if ( stream ) {
            streams[ streamName ].subscribe(
                observerOrOnNext, onError, onCompleted
            );

            return;
        }

        if ( !subscriptions.hasOwnProperty( streamName ) ) {
            subscriptions[ streamName ] = [];
        }

        subscriptions[ streamName ].push([
            observerOrOnNext, onError, onCompleted
        ]);
    }

});
