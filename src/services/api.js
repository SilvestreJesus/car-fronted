// src/api.js
import axios from 'axios';

// Aquí pegas la URL que te da Railway (la que termina en .up.railway.app)
const API_URL = 'https://car-bancked-production.up.railway.app/api';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;