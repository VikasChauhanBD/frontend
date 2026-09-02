// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000",
// });

// // Add token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://node-mysql-661s.onrender.com",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
