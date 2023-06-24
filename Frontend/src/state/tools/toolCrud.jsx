import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export function addTools(details, token) {
  let header = { headers: { Authorization: `Bearer ${token}` } };
  let formData = new FormData();
  for (let key of Object.keys(details)) {
    if (key === "images") {
      for (let image of details[key]) {
        formData.append("picture", image);
      }
    } else {
      formData.append(key, details[key]);
    }
  }
  return axios.post(`${API_URL}/tools`, formData, header);
}

export function fetchTool(id, token) {
  let header = { headers: { Authorization: `Bearer ${token}` } };
  return axios.get(`${API_URL}/tools/${id}`, header);
}

export function findTools(details, token) {
  let header = { headers: { Authorization: `Bearer ${token}` }, params: details };
  return axios.get(`${API_URL}/tools`, header);
}

export function borrowTool(details, token) {
  let header = { headers: { Authorization: `Bearer ${token}` } };
  return axios.post(`${API_URL}/lendings`, details, header);
}
export function fetchLendingsByToolId(id, token) {
  let header = { headers: { Authorization: `Bearer ${token}` }, params: { tool: id } };
  return axios.get(`${API_URL}/lendings`, header);
}

export function deleteTool(id, token) {
  let header = { headers: { Authorization: `Bearer ${token}` } };
  return axios.delete(`${API_URL}/tools/${id}`, header);
}