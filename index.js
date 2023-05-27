import url from "node:url";
import { body_request, url_request, url_raw, get_agent } from "./request.js";

const mighty_url = "http://localhost:5050/";

const mighty_protocol = "http";
const mighty_host = "localhost";
const mighty_port = 5050;


///
/// Builds a root url that can later append a pipeline
///
function build_url(protocol,host,port,pipeline) {
	return `${protocol}://${host}:${port}/`;
};


///
/// All awaited responses have this format, inspired by old-school (err,data) callback structure.
///
const MightyResponse = function(response) {
	this.err = response[0];
	this.response = response[1];
};


///
/// Pipelines that route to appropriate fetch patterns
///
const get_text = async function(url,text,ignored,agent) {
	return await body_request(url,{text:text},'POST',agent);
};

const get_question_answering = async function(url,question,context,agent) {
	return await url_request(url,{question:question,context:context},agent);
};

const get_cross_encoding = async function(url,text,document,agent) {
	return await url_request(url,{text:text,document:document},agent);
};

const pipelines = {
	"sentence-transformers":get_text,
	"sequence-classification":get_text,
	"token-classification":get_text,
	"embeddings":get_text,
	"cross-encoding":get_cross_encoding,
	"question-answering":get_question_answering,
	"text-visual":get_text
};

///
/// Single asyncronous Mighty client
///
export const Mighty = function(target,pipeline) {
	if (!target) {
		console.warn(`Mighty URL not specified, defaulting to ${mighty_url}`);
		target = mighty_url;
	}
	if (!pipeline) {
		console.warn("Mighty pipeline not specified, defaulting to embeddings.");
		this.url = target;
	} else if (pipelines[pipeline]) {
		this.url = target + pipeline;
	} else {
		throw new Error(`Pipeline "${pipeline}" is not supported.`);
	}
	this.pipeline = pipelines[pipeline];
	this.healthcheck_url = target + 'healthcheck';
	this.agent = get_agent();
	this._active = false;
};

Mighty.prototype.get = async function(text1,text2) {
	let self = this;
	self._active = true;
	let response = new MightyResponse(await self.pipeline(self.url,text1,text2,self.agent));
	self._active = false;
	return response;
};

Mighty.prototype.is_active = function() {
	return this._active;
};

Mighty.prototype.healthcheck = async function() {
	let self = this;
	self._active = true;
	let response = new MightyResponse(await url_raw(self.healthcheck_url));
	self._active = false;
	return response;
};



///
/// Connection Pooling - specify several ports to automatically distribute requests to different servers
///
export const MightyPool = function(urls,pipeline) {

	const self = this;

	self.clients = [];

	if (!pipeline) {
		console.warn("Mighty pipeline not specified, defaulting to embeddings.");
		pipeline = "embeddings";

	} else if (!pipelines[pipeline]) {
		throw new Error(`Pipeline "${pipeline}" is not supported.`);

	}

	self.pipeline = pipelines[pipeline];

	for (var i=0;i<urls.length;i++) {
		let obj = url.parse(urls[i]);

		if (obj.protocol != 'http:' && obj.protocol != 'https:') {
			throw new Error(`Invalid url '${urls[i]}'`);
		}

		let client = new Mighty(obj.href,pipeline);
		self.clients.push(client);
	}
};

MightyPool.prototype.wait_for_active_client = async function(DEBUG) {
	const self = this;
	let conn = null;
	while (!conn) {
		for(let i=0;i<self.clients.length;i++) {
			if (!self.clients[i].is_active()) {
				conn = self.clients[i];
				if (DEBUG) console.log(`Using ${self.clients[i].url}`);
				return conn;
			}
		}
		//Don't block the event loop, take another lap to wait for an available connection
		const delay = () => new Promise(resolve => setImmediate(resolve));
		await delay();
	}

	return conn;

};

MightyPool.prototype.get = async function(text1,text2,DEBUG) {
	const self = this;
	let connection = await self.wait_for_active_client(DEBUG);
	return connection.get(text1,text2);
};

MightyPool.prototype.healthcheck = async function(DEBUG) {
	const self = this;
	let connection = await self.wait_for_active_client(DEBUG);
	return connection.healthcheck();
};