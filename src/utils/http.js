import axios from 'axios';

class Http {
    constructor() {
        this.instance = axios.create({
            baseURL: 'https://localhost:7204/api',
            timeout: 6000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

const http = new Http().instance;

export default http;
