import axios from "axios";


const appAPI = axios.create({
    baseURL: "http://localhost:9090/api/v1",

});

export default appAPI;