const https = require('https');
const axios = require('axios');
const glob = require('glob');
const fs = require('fs');
const { logger } = require('../util/winston');
const DIR_PATH = process.env.FASTQC_PATH;

const LIMS_AUTH = {
    username: process.env.LIMS_USER,
    password: process.env.LIMS_PASSWORD,
};
const LIMS_URL = process.env.LIMS_URL;
const NGS_STATS_API_URL = process.env.NGS_STATS;
// LIMS is authorized. Avoids certificate verification & "unable to verify the first certificate in nodejs" errors
const agent = new https.Agent({
    rejectUnauthorized: false,
});

const axiosConfig = {
    httpsAgent: agent,
};

const info = (url) => logger.info(`Successfully retrieved response from ${url}`);
const errorlog = (url, error) => logger.error(`${url} : ${error}`);

const formatData = function (resp) {
    const data = resp.data || [];
    return data;
};

exports.getRecentDeliveries = () => {
    const url = `${LIMS_URL}/getRecentDeliveries`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url, error);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getSequencingRequests = () => {
    const url = `${LIMS_URL}/getSequencingRequests?days=30&delivered=false`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            // const data = resp.requests || [];
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url, error);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getRecentRuns = (numDays) => {
    const url = `${LIMS_URL}/getRecentRuns?days=${numDays}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            // const data = resp.requests || [];
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url, error);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getRequestProjects = () => {
    const url = `${LIMS_URL}/getRecentDeliveries?time=2&units=d`;
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getProjectQc = (projectId) => {
    const url = `${LIMS_URL}/getProjectQc?project=${projectId}`;
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getStatusPickListValues = () => {
    const url = `${LIMS_URL}/getPickListValues?list=Sequencing+QC+Status`;
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getCrossCheckMetrics = (projects) => {
    const url = `${NGS_STATS_API_URL}/getCrosscheckMetrics?projects=${projects}`;
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getInterOpsData = (runName) => {
    const url = `${LIMS_URL}/getInterOpsData?runId=${runName}`;
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getCellRangerSample = (project, ngsType) => {
    const url = `${NGS_STATS_API_URL}/getCellRangerSample?project=${project}&type=${ngsType}`;
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.ngsStatsDownload = (ngsType, sample, projectId, run, download = true) => {
    const url = `${NGS_STATS_API_URL}/getCellRangerFile?run=${run}&project=${projectId}&sample=${sample}&type=${ngsType}&download=${download}`;
    logger.info(`Submitting request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.setQCStatus = (id, qc_status, projectId, recipe) => {
    const payload = {
        'record': id,
        'status': qc_status,
        'project': projectId,
        'recipe': recipe
    }
    const url = `${LIMS_URL}/setQcStatus`;
    return axios
        .post(
            url,
            {},
            {
                auth: { ...LIMS_AUTH },
                httpsAgent: agent,
                ...axiosConfig,
                params: { ...payload },
            }
        )
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            if (error.response) {
                throw error.response.data;
            } else {
                throw error;
            }
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.requestRepool = (id, qc_status, recipe) => {
    const payload = {
        'record': id,
        'status': "Ready for - Pooling of Sample Libraries for Sequencing"
    }
    const url = `${LIMS_URL}/setPooledSampleStatus`;
    return axios
        .post(
            url,
            {},
            {
                auth: { ...LIMS_AUTH },
                httpsAgent: agent,
                ...axiosConfig,
                params: { ...payload },
            }
        )
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            if (error.response) {
                throw error.response.data;
            } else {
                throw error;
            }
        })
        .then((resp) => {
            return formatData(resp);
        });
}

exports.getRecentRunsData = async (days) => {
    await new Promise((resolve, reject) => {
        const fastQcFiles = `${DIR_PATH}*.html`;
        const today = new Date();
        glob(fastQcFiles, (error, files) => {
            if (error) {
                reject(error);
            }
            let recentRuns = [];
            files.forEach(async (file) => {
                let projectData = {};
                let mtime;
                let modifiedTimestamp = '';

                const stats = await fs.promises.stat(file)    
                mtime = new Date(stats.mtime);
                const modifiedDate = mtime.toISOString();
                //slice date and time out of modifiedDate string: 2022-10-21T14:05:30.074Z
                const tempDateString = modifiedDate.replace('T', ' ');
                modifiedTimestamp = tempDateString.substring(0, tempDateString.length - 8);

                const timeDiff = today.getTime() - mtime.getTime();
                const dayDiff = timeDiff / (1000*3600*24);

                if (dayDiff <= days) {
                    projectData.date = modifiedTimestamp;
                    const fileName = file.split('.')[0];
                    projectData.runName = fileName;
                    projectData.path = `static/html/FASTQ/${file}`;
                    projectData.runStats = `getInterOpsData?runId=${fileName}`;
                    recentRuns.push(projectData);
                }
                
            });
            resolve(recentRuns);
        });
    });
}
