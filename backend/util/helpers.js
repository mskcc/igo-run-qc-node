const { logger } = require('../util/winston');

// Adds properties to project object to display in the table
exports.addProjectProperties = (project) => {
    let projectObj = Object.assign({}, project);
    const samples = projectObj.samples;
    projectObj.needsReview = false;
    projectObj.ready = false;
    projectObj.allRuns = [];
    projectObj.recentDate = 0;

    if (samples.length > 0) {
        // Only one sample needs to have a non-empty 'basicQcs' field for the project to be considered ready
        for (let i = 0; i < samples.length; i++) {
            let sample = samples[i];
            if (sample.basicQcs && sample.basicQcs.length > 0) {
                projectObj.ready = true;

                // Based on the basicQcs::qcStatus of each sample. Only one sample in the project needs to be under-review to be un-reviewed
                for(let j = 0; j < sample.basicQcs.length; j++) {
                    let qc = sample.basicQcs[j];
                    if (qc.qcStatus === 'Under-Review') {
                        projectObj.needsReview = true;
                    }
                    if (qc.run) {
                        let trimmedRun = qc.run.substr(-11);
                        if (!projectObj.allRuns.includes(trimmedRun)) {
                            projectObj.allRuns.push(trimmedRun);
                        }
                    }
                    projectObj.recentDate = qc.createDate;
                }
            }
        }
    }
    return projectObj;
}