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