import Ember from 'ember';

/**
 * A service used to register, lookup, and subscribe indirectly to observables,
 * or "streams", and interact with their observing subjects
 *
 * @module
 * @augments ember/Service
 */
export default Ember.Service.extend({

    /**
     * An alias to the RxJS library itself
     *
     * @type {Object}
     */
    Rx: window.Rx,

    /**
     * Connect a stream to its subscription subjects
     *
     * @private
     * @function
     * @param {String} streamName - The name of the stream to connect to its
     *        subscription subjects
     * @returns {Boolean} - True unless an error is encountered
     */
    connectSubscriptions( streamName ) {
        const stream = this.get( 'streams' )[ streamName ];
        const subject = this.get( 'subjects' )[ streamName ];

        if ( stream && subject ) {
            stream.subscribe( subject );
        }

        return true;
    },

    /**
     * Create an observable stream from a function definition
     *
     * @function
     * @param {Function} subscribe - The stream observer handler
     * @returns {rx/Observable} - The created observable stream
     */
    create( subscribe ) {
        return window.Rx.Observable.create( subscribe );
    },

    /**
     * Create and register an observable from a function definition
     *
     * @function
     * @param {String} streamName - The name that the stream is registered on
     * @param {Function} subscribe - The stream observer handler
     * @returns {rx/Observable} - The created observable stream
     */
    define( streamName, subscribe ) {
        const stream = this.create( subscribe );

        this.register( streamName, stream );

        return stream;
    },

    /**
     * Destroy a registered observable
     *
     * @function
     * @param {String} streamName - The name of the stream to destroy
     * @returns {Boolean} - True unless an error is encountered
     */
    destroy( streamName ) {
        const streams = this.get( 'streams' );

        if ( streams.hasOwnProperty( streamName ) ) {
            delete streams[ streamName ];
        }

        return true;
    },

    /**
     * Lookup a stream by its registered name, and receive a promise
     *
     * @function
     * @param {String} streamName - The name of the stream to attempt lookup on
     * @returns {ember/RSVP/Promise} - Resolves with the observable instance
     */
    find( streamName ) {
        return new Ember.RSVP.Promise( ( resolve ) => {
            const streams = this.get( 'streams' );

            if ( streams.hasOwnProperty( streamName ) ) {
                resolve( streams[ streamName ] );
                return;
            }

            this.get( 'streamRegistrations' ).subscribe(
                function( registeredStreamName ) {
                    if ( registeredStreamName === streamName ) {
                        resolve( streams[ streamName ] );
                        this.dispose();
                    }
                }
            );
        });
    },

    /**
     * Register an observable stream to the supplied `streamName`
     *
     * @function
     * @param {String|Object} streamNameOrHash - Either the name to register a
     *        single stream to (the second argument), or a key-value hash where
     *        each key is the streamName and each value the stream instance
     * @param {rx/Observable} [stream] - The singular stream instance, if the
     *        first argument is a string representing its name
     * @returns {Boolean} - True unless an error is encountered
     */
    register( streamNameOrHash, stream ) {
        if ( 'object' === Ember.typeOf( streamNameOrHash ) ) {
            for ( const streamName of Object.keys( streamNameOrHash ) ) {
                this.register( streamName, streamNameOrHash[ streamName ] );
            }

            return true;
        }

        const streamName = streamNameOrHash;
        const streams = this.get( 'streams' );

        if ( streams.hasOwnProperty( streamName ) ) {
            this.destroy( streamName );
        }

        streams[ streamName ] = stream;
        this.get( 'streamRegistrations' ).onNext( streamName );

        this.connectSubscriptions( streamName );

        return true;
    },

    /**
     * A key-value hash for registered observable streams
     *
     * @private
     * @type {Object}
     */
    streams: {},

    /**
     * A subject used to emit registrations on the streams object
     *
     * @private
     * @type {rx/Subject}
     */
    streamRegistrations: new window.Rx.Subject(),

    /**
     * A key-value hash of subjects setup to listen to registered streams
     *
     * @private
     * @type {Object}
     */
    subjects: {},

    /**
     * Subscribe observer handlers to a stream with the specified `streamName`
     *
     * @function
     * @param {String} streamName - The name of the stream to subscribe to
     * @param {Function} onNext - onNext observer handler
     * @param {Function} [onError] - onError observer handler
     * @param {Function} [onCompleted] - onCompleted observer handler
     * @returns {rx/InnerSubscription} - A subscription object generated by
     *          the subscribe action
     */
    subscribe( streamName, onNext, onError, onCompleted ) {
        const subjects = this.get( 'subjects' );

        if ( !subjects.hasOwnProperty( streamName ) ) {
            subjects[ streamName ] = new window.Rx.Subject();
        }

        const subscription = subjects[ streamName ].subscribe(
            onNext, onError, onCompleted
        );

        this.connectSubscriptions( streamName );

        return subscription;
    }

});
