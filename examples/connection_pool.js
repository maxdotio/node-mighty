import { MightyPool } from "../index.js";

const protocol = "http";
const host = "192.168.1.20"; //a machine that has 4 mighty servers running
const ports = [5050,5051,5052,5053]; //a machine that has 4 mighty servers running

/// sentence-transformers
function sentence_transformers() {
	return new MightyPool(protocol,host,ports,"sentence-transformers");
}

/// sequence-classification
function sequence_classification() {
	return new MightyPool(protocol,host,ports,"sequence-classification");
}

/// token-classication
function token_classication() {
	return new MightyPool(protocol,host,ports,"token-classication");
}

/// question-answering
function question_answering() {
	return new MightyPool(protocol,host,ports,"question-answering");
}

/// embeddings
function embeddings() {
	return new MightyPool(protocol,host,ports,"embeddings");
}


let mighty = sentence_transformers();
//let mighty = sequence_classification();
//let mighty = token_classication();
//let mighty = question_answering();
//let mighty = embeddings();

let getter = function(num,mighty){
	return async function() {
		let DEBUG = true;
		let res = await mighty.get("Hello, Mighty!",null,DEBUG);
		if (!res.err) console.log(`${num} took ${res.response.took}ms`);
	}
};

let asker = function(num,mighty){
	return async function() {
		let res = await mighty.get("What is Mighty?  It is a fast NLP server");
		if (!res.err) console.log(`${num} took ${res.response.took}ms`);
	}
};

for(var i=0;i<20;i++) {
	setImmediate(getter(i,mighty));
	//setImmediate(asker(i));
};