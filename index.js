import { body_request, url_request } from "./request.js";

const mighty_url = "http://localhost:5050/";

const MightyResponse = function(response) {
	this.err = response[0];
	this.response = response[1];
}

const get_text = async function(url,text,ignore) {
	return await body_request(url,{text:text});
};

const get_question_answering = async function(url,question,context) {
	return await url_request(url,{question:question,context:context});
};

const pipelines = {
	"sentence-transformers":get_text,
	"sequence-classification":get_text,
	"token-classication":get_text,
	"embeddings":get_text,
	"question-answering":get_question_answering,
};

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
};

Mighty.prototype.get = async function(text1,text2) {
	let self = this;
	return new MightyResponse(await self.pipeline(self.url,text1,text2));
};