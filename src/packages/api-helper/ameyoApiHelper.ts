// api-client.js

import ApiHelper from 'axios';
import AmeyoLogger from '../ameyo-logger';

// Add a request interceptor
ApiHelper.interceptors.request.use(function (config) {
  // Do something before request is sent
  //   config.headers.sessionId = "d500-5fce26bb-ses-Administrator-NhBWBFNz-20";
  AmeyoLogger.log("this is API middleware, config: " + JSON.stringify(config));
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
ApiHelper.interceptors.response.use(function (response) {
  // Do something with response data
  AmeyoLogger.log("this is API middleware [Response] " + JSON.stringify(response.data));
  return response;
}, function (error) {
  // Do something with response error
  AmeyoLogger.log("this is middleware error [Response] " + error);

  return Promise.reject(error);
});

/**
 * TODO
 * get its value from env variable
 */
ApiHelper.defaults.baseURL = "";
export default ApiHelper;