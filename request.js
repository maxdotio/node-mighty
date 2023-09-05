const http = require("http");
const axios = require("axios");

function get_agent() {
  return new http.Agent({
    keepAlive: false,
  });
}

async function body_request(url, body, method = "POST", agent) {
  const config = {
    method,
    url,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: body ? JSON.stringify(body) : null,
    httpAgent: agent,
  };
  try {
    const { data } = await axios(config);
    return [null, data];
  } catch (ex) {
    return [ex, null];
  }
}

async function url_request(url, params, agent) {
  if (params) {
    url += "?" + new URLSearchParams(params).toString();
  }
  const config = {
    method: "GET",
    url,
    httpAgent: agent,
  };
  try {
    const { data } = await axios(config);
    return [null, data];
  } catch (ex) {
    return [ex, null];
  }
}

async function url_raw(url, agent) {
  const config = {
    method: "GET",
    url,
    responseType: "stream",
    httpAgent: agent,
  };
  try {
    const response = await axios(config);
    return [null, response];
  } catch (ex) {
    return [ex, null];
  }
}

module.exports = { "get_agent":get_agent, "body_request":body_request, "url_request":url_request, "url_raw":url_raw };