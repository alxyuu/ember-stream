# Ember Stream

[![NPM Version](https://img.shields.io/npm/v/ember-stream.svg?style=flat-square)](https://www.npmjs.com/package/ember-stream)
[![Ember CLI Version](https://img.shields.io/badge/ember--cli-1.13.1-d84a32.svg?style=flat-square)](http://www.ember-cli.com)
[![Ember Version](https://img.shields.io/badge/ember-1.13.3-e1563f.svg?style=flat-square)](http://emberjs.com)

Observable streams addon for Ember CLI projects, using [ReactiveX](http://reactivex.io) ([RxJS](https://github.com/Reactive-Extensions/RxJS)).

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

##### .Rx

This is an alias to the main Rx library, so that any object using the streamService has direct access to the native Reactive functionality.

##### .createStream( func )

Create an observable stream from a function definition. This currently just wraps *Rx.Observable.create()*, but in the future will support additional Ember-friendly patterns.

##### .findStream( streamName )

Lookup and return a named stream registered on the streamService.

##### .registerStream( streamName, stream )

Register an observable stream to a referenceable name. Any observers that are awaiting subscription to this stream will be subscribed at this point.

##### .registerStreams( streamsObject )

Register multiple streams to their own names. The `streamsObject` is a key-value hash, where each key is the stream name, and each value is the stream instance.

##### .subscribeTo( streamName, observerOrOnNext, onError, onCompleted )

Attempt to subscribe an observer or series of callbacks to an observable stream.

If a stream is registered with the `streamName`, then the subscription is setup and an object is returned.

If no observer is registered with the `streamName`, then the subscription will be deferred until the stream is registered, and a promise is returned.

There are two ways to call this method:

- Pass in the `streamName` and at least one callback function
- Pass in the `streamName` and an Rx.Observer object

##### .unregisterStream( streamName )

Remove the named reference to the stream registered to `streamName`.

##### .unregisterStreams( streamNames )

Unregister multiple streams by passing in their names in an array `streamNames`.

## Installation

- `git clone` this repository
- `npm install`
- `bower install`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
