import axios from "axios";
import { API_URL } from "../config";
import { getToken } from "./session";

let headers = {
    'Content-Type': 'application/json'
};

const token = getToken();

if (token) {
    headers['Authorization'] = `Bearer ${token}`;
}

export default axios.create({
    baseURL: API_URL,
    // timeout: 5000,
    headers,
});