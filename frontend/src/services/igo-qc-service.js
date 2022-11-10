import axios from "axios";

import config from "../config.js";
// import { handleError, getData } from '../utils/service-utils';

const parseResp = function(resp) {
  const data = resp.data || [];
  return data;
};

/**
 * Sends service call to retrieve most recent deliveries
 */
export function getSeqAnalysisProjects() {
  return axios
    .get(config.NODE_API_ROOT + "/homePage/getSeqAnalysisProjects")
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error("Unable to fetch Seq Analysis Projects: " + error);
    });
}
/**
 * Sends service call to retrieve most recent deliveries
 */
export function getRequestProjects() {
  return axios
    .get(config.NODE_API_ROOT + "/homePage/getRequestProjects")
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error("Unable to fetch Request Projects: " + error);
    });
}
// export const getProjectInfo = (projectId) => {
//     return axios.get(config.IGO_QC + `/projectInfo/${projectId}`)
//         .then(getData)
//         .catch(handleError)
// };

export const getProjectQC = projectId => {
  return axios
    .get(config.NODE_API_ROOT + `/project/getProjectQc/${projectId}`)
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error("Unable to fetch Project QC: " + error);
    });
};

// export const setRunStatus = (run, project, status, recipe) => {
//     return axios.get(`${config.IGO_QC}/changeRunStatus?recordId=${run}&project=${project}&status=${status}&recipe=${recipe}`)
//         .then(getData)
//         .catch(handleError)
// };

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
  const params = numDays ? `?days=${numDays}` : "";
  return axios
    .get(`${config.NODE_API_ROOT}/homePage/getRecentRuns${params}`)
    .then(resp => {
      return parseResp(resp);
    })
    .catch(error => {
      throw new Error("Unable to fetch Recent Runs: " + error);
    });
}
// export function saveConfig(type, value){
//     return axios.post(config.IGO_QC + '/saveConfig', { type, value })
//         .then(resp => {return parseResp(resp) })
//         .catch(error => {throw new Error('Failed to log in: ' + error) });
// }
