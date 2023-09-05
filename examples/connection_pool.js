const { MightyPool } =require("../index.js");

//192.168.1.17 is a machine that has 4 mighty servers running on ports 5050 through 5053
const urls = [
	"http://risa:5050"
]

/// sentence-transformers
function sentence_transformers() {
	return new MightyPool(urls,"sentence-transformers");
}

/// sequence-classification
function sequence_classification() {
	return new MightyPool(urls,"sequence-classification");
}

/// token-classication
function token_classication() {
	return new MightyPool(urls,"token-classication");
}

/// question-answering
function question_answering() {
	return new MightyPool(urls,"question-answering");
}

/// embeddings
function embeddings() {
	return new MightyPool(urls,"embeddings");
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
		if (!res.err) console.log(`${num} inference took ${res.response.took}ms`);
	}
};

let asker = function(num,mighty){
	return async function() {
		let res = await mighty.get("What is Mighty?  It is a fast NLP server");
		if (!res.err) console.log(`${num} asker took ${res.response.took}ms`);
	}
};

let healthy = function(num,mighty){
	return async function() {
		let DEBUG = true;
		let start = new Date();
		let res = await mighty.healthcheck();
		let end = new Date();
		if (!res.err) console.log(`${num} healthcheck took ${end-start}ms`);
		if (res.err) console.log(`${num} healthcheck ERROR ${end-start}ms`);
	}
};

for(var i=0;i<50;i++) {
	setImmediate(getter(i,mighty));
	//setImmediate(asker(i,mighty));
	setImmediate(healthy(i,mighty));
};