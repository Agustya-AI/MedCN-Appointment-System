import axios from "axios";



const appAPI = axios.create({
    baseURL: "https://medcn-appointment-system.onrender.com/api/v1",

});

export default appAPI;