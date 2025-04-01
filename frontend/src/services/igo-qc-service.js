import axios from 'axios';
import config from '../config.js';

axios.defaults.withCredentials = true;

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
      // Do something with response data
      if (response.data.data) {
          response.payload = response.data.data;
          return response;
      }
      if (response.data) {
          response.payload = response.data;
          return response;
      }
      return response;
  },
  function(error) {
      // console.log(error);
      if (error.response) {
          error.payload = error.response.data;
          if (error.response.status === 401) {
              // Automatically redirect client to the login page
              window.location.href = `${config.AUTH_URL}/${config.SITE_HOME}`;
          }
      }
      // Do something with response error
      return Promise.reject(error);
  }
);


const parseResp = function(resp) {
  const data = resp.data || [];
  return data;
};

const formatError = function (error) {
  const status = error.response.status;
  const message = error.response.data.message || '';
  return {
      status,
      message
  };
};

/**
 * Sends service call to retrieve most recent deliveries
 */
export function getSeqAnalysisProjects() {
  return axios
    .get(config.NODE_API_ROOT + '/homePage/getSeqAnalysisProjects')
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error('Unable to fetch Seq Analysis Projects: ' + error);
    });
}
/**
 * Sends service call to retrieve most recent deliveries
 */
export function getRequestProjects() {
  return axios
    .get(config.NODE_API_ROOT + '/homePage/getRequestProjects')
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error('Unable to fetch Request Projects: ' + error);
    });
}

export function getCrosscheckMetrics(projects) {
  return axios
    .get(config.NODE_API_ROOT + `/homePage/getCrosscheckMetrics?projects=${projects}`)
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      console.log('Unable to fetch Crosscheck Metrics: ' + error);
      return formatError(error);
    });
}

export const getProjectQC = projectId => {
  return axios
    .get(config.NODE_API_ROOT + `/project/getProjectQc/${projectId}`)
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      console.log('Unable to fetch Project QC: ' + error);
      return formatError(error);
    });
};

export function getInterOpsData(runId) {
  return axios
    .get(config.NODE_API_ROOT + `/homePage/getInterOpsData?runId=${runId}`)
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error('Unable to fetch InterOps Data: ' + error);
    });
};

export const setRunStatus = (run, project, status, recipe, qcType) => {
    return axios.get(`${config.NODE_API_ROOT}/project/changeRunStatus?recordId=${run}&project=${project}&status=${status}&recipe=${recipe}&qcType=${qcType}`)
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      console.log('Unable to update run status: ' + error);
      return formatError(error);
    });
};

// export const addComment = (projectId, commentText, username) => {
//     const data = { projectId, commentText, username };
//     return axios.post(`${config.IGO_QC}/addComment`, data)
//             .then(getData)
//             .catch(error => {throw new Error('Unable to add comment: ' + error) });
// };

// export const getComments = (projectId) => {
//     return axios.get(`${config.IGO_QC}/getComments/${projectId}`)
//     .then(resp => { return JSON.parse(parseResp(resp)) })
//     .catch(error => {throw new Error('Unable to fetch comments: ' + error) });
// }
/**
 * Sends service call to retrieve chart data about most recent runs
 */
export function getRecentRuns(numDays) {
  const params = numDays ? `?days=${numDays}` : '';
  return axios
    .get(`${config.NODE_API_ROOT}/homePage/getRecentRuns${params}`)
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error('Unable to fetch Recent Runs: ' + error);
    });
}
// export function saveConfig(type, value){
//     return axios.post(config.IGO_QC + '/saveConfig', { type, value })
//         .then(resp => {return parseResp(resp) })
//         .catch(error => {throw new Error('Failed to log in: ' + error) });
// }
