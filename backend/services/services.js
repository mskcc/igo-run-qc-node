const https = require('https');
const axios = require('axios');
const { logger } = require('../util/winston');

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
    //TODO BREAK PROJECTS INTO COMMA SEPARATED LIST?
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
