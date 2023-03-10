import axios from "axios"
import { CheckAPIResponse, CommonConsole } from "../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"

const API_URL = "http://192.168.1.114:8000"

const axiosApi = axios.create({
  baseURL: API_URL,
})

const AuthonticationFunction = () => {
  const token = "Bearer " + (localStorage.getItem("token"))
  if (token) {
    axiosApi.defaults.headers.common["Authorization"] = token
  }
  else {
    axiosApi.defaults.headers.common["Authorization"] = ""
  }
}

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export function get(url, btnId) {

  CommonConsole("get api call");
  AuthonticationFunction();

  return axiosApi.get(url)
    .then(response => {
      return CheckAPIResponse({ method: "get", url, response, btnId });
    })
    .catch(error => {
      return CheckAPIResponse({ method: "get", url, error, btnId });
    });

}

export function post(url, data, btnId) {

  CommonConsole("Post api call");
  AuthonticationFunction();

  return axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    }).then(response => {
      return CheckAPIResponse({ method: "post", url, response, data, btnId });
    }).catch(response => {
      return CheckAPIResponse({ method: "post", url, response, data, btnId });
    });
};


export function put(url, data, btnId,) {

  CommonConsole("put api call");
  AuthonticationFunction();

  return axiosApi.put(url, data, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  }).then(response => {
    return CheckAPIResponse({ method: "put", url, response, data, btnId });
  }).catch(response => {
    return CheckAPIResponse({ method: "put", url, response, btnId });
  });
}

export function del(url, btnId) {

  CommonConsole(" delete api call");
  AuthonticationFunction();

  return axiosApi.delete(url,).then(response => {
    return CheckAPIResponse({ method: "delete", url, response, btnId });
  }).catch(response => {
    return CheckAPIResponse({ method: "delete", url, response, btnId });
  });
}

// for forget password
export function postForget(url, data,) {
  return axiosApi
    .post(url, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      return CheckAPIResponse({ method: "postForget", url, response });
    })
    .catch(response => {
      return CheckAPIResponse({ method: "postForget", url, response });
    });

}

export async function getModify(url) {
  AuthonticationFunction();
  return axiosApi.get(url).then(response => {
    return CheckAPIResponse({ method: "get", url, response });
  })
    .catch(response => {
      return CheckAPIResponse({ method: "get", url, response });
    });
}