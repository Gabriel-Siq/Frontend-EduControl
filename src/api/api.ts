import axios from 'axios'

const baseURL = 'https://localhost:44334'

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;