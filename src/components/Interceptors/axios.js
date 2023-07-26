import axios from 'axios'

// let token = localStorage.getItem('auth');

// axios.defaults.baseURL = 'https://devgrow.coreach.co';
axios.defaults.baseURL = 'https://reach.grow.coreach.co/';
// if(token){
//   axios.defaults.headers.common['Authorization'] = token;
// }


axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    if(error.response.status == 401){
        localStorage.clear();
        for (var i = 0; i < 2; i++) {
            window.clearInterval(i);
        }
        window.location.reload();

    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });