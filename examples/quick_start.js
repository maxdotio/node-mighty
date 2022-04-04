import { Mighty } from "../index.js";

/// sentence-transformers
async function sentence_transformers() {
	const mighty = new Mighty("http://localhost:5050/","sentence-transformers");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);
}

/// sequence-classification
async function sequence_classification() {
	const mighty = new Mighty("http://localhost:5050/","sequence-classification");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);
}

/// token-classication
async function token_classication() {
	const mighty = new Mighty("http://localhost:5050/","token-classication");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);
}

/// question-answering
async function question_answering() {
	const mighty = new Mighty("http://localhost:5050/","question-answering");
	let res = await mighty.get("What is Mighty?  It is a fast NLP server");
	if (!res.err) console.log(res.response.answer);
}

/// embeddings
async function embeddings() {
	const mighty = new Mighty("http://localhost:5050/","embeddings");
	let res = await mighty.get("Hello, Mighty!");
	if (!res.err) console.log(res.response);
}


sentence_transformers();
//sequence_classification();
//token_classication();
//question_answering();
//embeddings();