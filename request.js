import http from "http";
import fetch from "node-fetch";

export function get_agent() {
    return new http.Agent({
            keepAlive: false
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

    try {
        let response = await fetch(url, fetch_spec);
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

    try {
        if (agent) {
            let response = await fetch(url,{agent:agent});
        } else {
            let response = await fetch(url);
        }
        const output = await response.json();
        return [null,output];
    } catch(ex) {
        const output = null;
        return [ex,output];
    }
}