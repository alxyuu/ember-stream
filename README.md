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

##### .create( streamName, subscribe )

Create and register an observable stream from a subscribe function definition.

##### .destroy( streamName )

Destroy a registered observable stream from the service.

##### .find( streamName )

Lookup a stream by its registered name, and receive a promise that is fulfilled whenever the matching stream is registered.

##### .register( streamNameOrHash, stream )

Register a stream, or streams, to the service, in one of two formats:

- Pass in a string value and a stream instance to register a single stream
- Pass in a key-value hash, where each key is a stream name and each value its stream instance

##### .subscribe( streamName, onNext, onError, onCompleted )

Set up a subscription to a stream named with `streamName`, using the given handler functions.

## Installation

- `git clone` this repository
- `npm install`
- `bower install`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
