# node-mighty

Node client for Mighty Inference Server (https://max.io)

## Installation

`npm install node-mighty`

Assuming you have a running Mighty server, You can connect to a Mighty server and send inference requests:

```javascript
import {Mighty} from 'node-mighty';
const mighty = new Mighty("http://localhost:5050/","sentence-transformers");
let res = await mighty.get("Hello, Mighty!");
if (!res.err) console.log(res.response);
```

The pipeline name must match the pipeline running on the Mighty server.

## API

Once you have a `mighty` instance, the only method is `get` which should either be passed some text, or for question answering a question/context pair.

`get` is asyncronous and must be `await`ed.  `get` returns a MightyResponse object - which only has two properties: `err` and `response`.

Always check for presence of `err`.  If `err` is not null, then the response might not be valid.

See the https://github.com/maxdotio/node-mighty/blob/main/example/quick_start.js file for working examples of each pipeline.

## Supported Pipelines

The following pipelines are currently supported.  For more information on these, or if you are new to Mighty, see the about page: https://max.io/about.html and the documentation: https://max.io/documentation.html


### sentence-transformers

```javascript
const mighty = new Mighty("http://localhost:5050/","sentence-transformers")
let res = await mighty.get("Hello, Mighty!");
if (!res.err) console.log(res.response);
```

### sequence-classification

```javascript
const mighty = new Mighty("http://localhost:5050/","sequence-classification")
let res = await mighty.get("Hello, Mighty!");
if (!res.err) console.log(res.response);
```

### token-classication

```javascript
const mighty = new Mighty("http://localhost:5050/","token-classication")
let res = await mighty.get("Hello, Mighty!");
if (!res.err) console.log(res.response);
```

### embeddings

```javascript
const mighty = new Mighty("http://localhost:5050/","embeddings")
let res = await mighty.get("Hello, Mighty!");
if (!res.err) console.log(res.response);
```

### question-answering

```javascript
const mighty = new Mighty("http://localhost:5050/","question-answering")
let res = await mighty.get("What is Mighty?  It is a fast NLP server");
if (!res.err) console.log(res.response.answer);
```

### healthcheck

This will ping a mighty connection's healtcheck endpoint and ensure it returns a 200 status code.  It works with any pipeline.

```javascript
const mighty = new Mighty("http://localhost:5050/","sentence-transformers")
let res = await mighty.healthcheck();
if (!res.err) console.log(res.response);
if (res.err) console.error(res.err);
```


## Connection Pooling

It is common to scale Mighty by running it on several ports/cores on one instance.  To make use of all the available Mighty processes on that instance, we provide an easy to use connection pool that will automatically do this.  It keeps a queue of requests and does not block the event loop - suitable for use in async node web servers.

Assuming you have a 4 running Mighty servers on the same host, You can create a pool and send requests easily:

```javascript
import {MightyPool} from 'node-mighty';

const protocol = "http";
const host = "192.168.1.20"; //a machine that has 4 mighty servers running
const ports = [5050,5051,5052,5053]; //the ports that the Mighty servers are using
const mighty = new MightyPool(protocol,host,ports,"sentence-transformers");

let res = await mighty.get("Hello, Mighty!");
if (!res.err) console.log(res.response);
```

A more thorough example is included in examples/connection_pool.js, with the following simulation of 20 requests being handled:

```javascript
let getter = function(num,mighty){
	return async function() {
		let DEBUG = true;
		let res = await mighty.get("Hello, Mighty!",null,DEBUG);
		if (!res.err) console.log(`${num} took ${res.response.took}ms`);
	}
};

for(var i=0;i<20;i++) {
	setImmediate(getter(i,mighty));
};

let res = await mighty.get("Hello, Mighty!");
if (!res.err) console.log(res.response);
```

