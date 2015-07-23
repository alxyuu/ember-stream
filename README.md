# Ember Stream [![NPM Version](https://img.shields.io/npm/v/ember-stream.svg?style=flat-square)](https://www.npmjs.com/package/ember-stream)

Observable streams addon for Ember CLI projects, using [RxJS](https://github.com/Reactive-Extensions/RxJS).

## Use in Ember CLI

```bash
ember install ember-stream
```

### Stream Service

The primary object available is the stream service, located at `/addon/services/stream.js`. You should inject this service into your Ember objects:

```javascript
    streamService: Ember.inject.service( 'stream' ),
```

This service has the following methods available:

##### Rx

This is an alias to the main Rx library, so that any object using the streamService has direct access to the native Reactive functionality.

##### createStream( func )

Create an observable stream from a function definition. This currently just wraps *Rx.Observable.create()*, but in the future will support more Ember-friendly patterns.

##### findStream( streamName )

Lookup and return a named stream registered on the streamService.

##### registerStream( streamsObjectOrName, stream )

Register an observable stream to a referenceable name. Any observers that are awaiting subscription to this stream will be subscribed at this point.

There are two ways to call this method:

- Pass in a single name and stream instance
- Pass in a key-value hash, where the key is the stream name, and the value is the stream instance

##### subscribeTo( streamName, observerOrOnNext, onError, onCompleted )

Attempt to subscribe an observer or series of callbacks to an observable stream. If no observer is registered under the `streamName`, then the subscription will not be setup until the stream is registered.

There are two ways to call this method:

- Pass in the `streamName` and at least one callback function
- Pass in the `streamName` and an Rx.Observer object

## Installation

- `git clone` this repository
- `npm install`
- `bower install`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
