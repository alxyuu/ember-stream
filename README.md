# Ember Stream

[![NPM Version](https://img.shields.io/npm/v/ember-stream.svg?style=flat-square)](https://www.npmjs.com/package/ember-stream)
[![Ember CLI Version](https://img.shields.io/badge/ember--cli-v1.13.6-d84a32.svg?style=flat-square)](http://www.ember-cli.com)

Observable streams addon for Ember, using [ReactiveX](http://reactivex.io) ([RxJS](https://github.com/Reactive-Extensions/RxJS)).

## Use in Ember CLI

```bash
ember install ember-stream
```

### Mixin: StreamEnabled (mixins/stream-enabled)

This mixin supplies the following properties to its host object:

##### stream

An instantiated stream object, outlined below; only created if a `streamName` property is set at initialization.

The `stream` is also automatically *disposed* of when this object's `willDestroy` or `willDestroyElement` hooks are triggered.

##### streamName

A string to register this object's `stream` to. This value is used in the streamService's *send* method.

##### streamService

The injected streamService, outlined below.

### Service: Stream (services/stream)

This service has the following methods available:

##### create( streamName )

Create and receive a new stream object with the supplied `streamName`. This object has the following properties:

- *name* - The registered string name of the stream
- *on*( actionName, handler ) - Call to set up an observer `handler` function for the specified `actionName`; any data passed on through the action using *send* will be received by the `handler`
- *subject* - The underlying Rx/Subject instance representing the low-level observable/observer functionality

##### send( streamName, action, data )

Send the stream registered with `streamName` a message named `action` (string), along with optional `data`.

## Installation

- `git clone` this repository
- `npm install`
- `bower install`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
