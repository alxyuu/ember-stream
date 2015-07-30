import Ember from 'ember';

/**
 * This mixin enables automatic creation and destruction of a `stream` property
 * when the component it's being mixed into supplies a `streamName` property
 *
 * @module
 * @augments ember/Mixin
 */
export default Ember.Mixin.create({

    /**
     * The stream that this component listens on
     *
     * @type {?rx/Subject}
     */
    stream: null,

    /**
     * The name of the stream to setup for this component
     *
     * @type {?String}
     */
    streamName: null,

    /**
     * The injected streamService object
     *
     * @type {ember/Service}
     */
    streamService: Ember.inject.service( 'stream' ),

    /**
     * Create the component's bound stream on initialization with `streamName`
     *
     * @listens init
     * @function
     * @returns {undefined}
     */
    init() {
        this[ '_super' ]();

        const streamName = this.get( 'streamName' );

        if ( streamName ) {
            const streamService = this.get( 'streamService' );
            const stream = streamService.create( this.get( 'streamName' ) );

            this.set( 'stream', stream );
        }
    },

    /**
     * Destroy the bound stream when the component is being destroyed
     *
     * @listens willDestroyElement
     * @function
     * @returns {undefined}
     */
    destroyStream: Ember.on(
        'willDestroy',
        'willDestroyElement',
        function() {
            const stream = this.get( 'stream' );

            if ( stream ) {
                stream.subject.onCompleted();
            }
        }
    )

});
