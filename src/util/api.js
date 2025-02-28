import axios from "axios";
import baseURL from "../data/baseURL";

const api = axios.create({
    baseURL: baseURL
})

export default api;