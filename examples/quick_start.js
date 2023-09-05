const { Mighty,MightyPool } = require("../index.js");


//const mighty_url = "http://localhost:5050/";
const mighty_url = "http://risa:5050/";

/// sentence-transformers
async function sentence_transformers() {
	const mighty = new Mighty(mighty_url,"sentence-transformers");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);

	const pool = new MightyPool([mighty_url],"sentence-transformers");
	res = await pool.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);	
}

/// sequence-classification
async function sequence_classification() {
	const mighty = new Mighty(mighty_url,"sequence-classification");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);
}

/// token-classication
async function token_classication() {
	const mighty = new Mighty(mighty_url,"token-classication");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);
}

/// question-answering
async function question_answering() {
	const mighty = new Mighty(mighty_url,"question-answering");
	let res = await mighty.get("What is Mighty?  It is a fast NLP server");
	if (!res.err) console.log(res.response.answer);
}

/// embeddings
async function embeddings() {
	const mighty = new Mighty(mighty_url,"embeddings");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);
}


sentence_transformers();
//sequence_classification();
//token_classication();
//question_answering();
//embeddings();