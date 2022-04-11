import { body_request, url_request, get_agent } from "./request.js";

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
	return await url_request(url,{question:question,context:context},'GET',agent);
};

const pipelines = {
	"sentence-transformers":get_text,
	"sequence-classification":get_text,
	"token-classication":get_text,
	"embeddings":get_text,
	"question-answering":get_question_answering,
};

///
/// Single asyncronous Mighty client
///
export const Mighty = function(url,pipeline) {
	if (!url) {
		console.warn(`Mighty URL not specified, defaulting to ${mighty_url}`);
		url = mighty_url;
	}
	if (!pipeline) {
		console.warn("Mighty pipeline not specified, defaulting to embeddings.");
		this.url = url;
	} else if (pipelines[pipeline]) {
		this.url = url + pipeline;
	} else {
		throw new Error(`Pipeline "${pipeline}" is not supported.`);
	}
	this.pipeline = pipelines[pipeline];
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


///
/// Connection Pooling - specify several ports to automatically distribute requests to different servers
///
export const MightyPool = function(protocol,host,ports,pipeline) {

	this.clients = [];

	if (!protocol) {
		console.warn(`Mighty protocol not specified, defaulting to ${mighty_protocol}`);
		protocol = mighty_host
	}

	if (!host) {
		console.warn(`Mighty host not specified, defaulting to ${mighty_host}`);
		host = mighty_host
	}

	if (!ports) {
		console.warn(`Mighty ports not specified, defaulting to [${mighty_port}]`);
		ports = [mighty_port];
	} else if ((!isNaN(ports)) && (!(ports instanceof Array))) {
		ports = [ports];
	} else if (!(ports instanceof Array)) {
		ports = [mighty_port];
	}

	if (!pipeline) {
		console.warn("Mighty pipeline not specified, defaulting to embeddings.");
		pipeline = "embeddings";

	} else if (!pipelines[pipeline]) {
		throw new Error(`Pipeline "${pipeline}" is not supported.`);

	}

	this.pipeline = pipelines[pipeline];

	for (var i=0;i<ports.length;i++) {
		let url = build_url(protocol,host,ports[i]);
		let client = new Mighty(url,pipeline);
		this.clients.push(client);
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