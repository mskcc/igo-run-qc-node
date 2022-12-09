import { PROJECT_FLAGS,  LIMS_REQUEST_ID, CROSSCHECK_METRICS_FLAG } from './constants';

export const setProjectFlags = (projectList, crosscheckMetrics) => {
    if(projectList === null || Object.keys(projectList).length === 0) return;
    const type = 'Fingerprinting';
    const updatedProjects = projectList.map((project) => {
        const pId = project[LIMS_REQUEST_ID];
        const projectEntry = crosscheckMetrics[pId] || {};
        const flags = projectEntry[CROSSCHECK_METRICS_FLAG];
        if(flags !== null && flags !== undefined){
            project[PROJECT_FLAGS] = {
                [type]: flags
            };
        }
        return project;
    });
    
    return updatedProjects;
};
