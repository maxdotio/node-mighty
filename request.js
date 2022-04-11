import http from "http";
import fetch from "node-fetch";

export function get_agent() {
    return new http.Agent({
            keepAlive: true
    });
};

export async function body_request(url,body,method,agent){
    method = method || "POST";

    let fetch_spec = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    //Optional args
    if (body) fetch_spec.body = JSON.stringify(body);
    if (agent) fetch_spec.agent = agent;

    let response = await fetch(url, fetch_spec);

    try {
        const output = await response.json();
        return [null,output];
    } catch(ex) {
        const output = null;
        return [ex,output];
    }
}


export async function url_request(url,params,agent){

    if (params) {
        url += "?" + new URLSearchParams(params).toString();
    }

    if (agent) {
        let response = await fetch(url,{agent:agent});
    } else {
        let response = await fetch(url);
    }

    try {
        const output = await response.json();
        return [null,output];
    } catch(ex) {
        const output = null;
        return [ex,output];
    }
}