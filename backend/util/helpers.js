const e = require('express');

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
                        let trimmedRun = qc.run.substring(0, qc.run.length - 11);
                        if (!projectObj.allRuns.includes(trimmedRun)) {
                            projectObj.allRuns.push(trimmedRun);
                        }
                    }
                    const numericDate = qc.createDate
                    const stringDate = new Date(numericDate).toISOString();
                    //slice date and time out of stringDate string: 2022-10-21T14:05:30.074Z
                    const tempDateString = stringDate.replace('T', ' ');
                    const formattedDate = tempDateString.substring(0, tempDateString.length - 8);
                    projectObj.date = formattedDate;
                    projectObj.recentDate = numericDate;
                    projectObj.ordering = numericDate;
                }
            }
        }
    }
    return projectObj;
};

exports.getProjectInfo = (projectQc, projectStatusList) => {
    const samples = projectQc.samples;
    const commonSample = samples[0];
    let requester = this.getRequesterInfo(projectQc, commonSample);
    let statuses = {};
    let recordIds = [];
    // getStatuses, getRecordIds, enrichSamples, and some of getRequesterInfo all loop through samples
    // move that logic into here for better efficiency!

    let sampleNames = [];
    let tumorCount = 0;
    let normalCount = 0;
    let labels = [];
    let enrichedSamples = [];

    for(let i = 0; i < projectStatusList.length; i++) {
        statuses[i] = 0;
    }
    samples.forEach((sample) => {
        let sampleQC = sample['qc'];
        let name = sampleQC['sampleName'];
        recordIds.push(sampleQC['recordId']);

        if(!sampleNames.includes(name)) {
            sampleNames.push(name);
            if(sample['tumorOrNormal'] === 'Tumor') {
                tumorCount++;
            } else if(sample['tumorOrNormal'] === 'Normal') {
                normalCount++;
            }
        }

        // statuses: Double check this is right... idk
        if(!(sampleQC['recordId'] in labels)) {
            if(!('qcStatus' in sampleQC)){
                labels.push(sampleQC['recordId']);
            } else {
                statuses[sampleQC['qcStatus']] += 1;
            }
        }

        // enriching done in separate function for readability

    });

    // rest of requester info
    requester['tumorCount'] = tumorCount;
    requester['normalCount'] = normalCount;
    if(!('sampleNumber' in projectQc)) {
        requester['numSamples'] = sampleNames.length;
    } else {
        requester['numSamples'] = projectQc['sampleNumber'];
    }

    const projectInfo = {
        'requester': requester,
        'statuses': statuses,
        'recordIds': recordIds
    };
    
    return projectInfo;
    // separate functions: getChartLinks, getProjectType, grid(find js equivalent)

};

exports.getRequesterInfo = (projectQc, sample) => {
    const labelValues = ['requestId', 'investigator',  'pi', 'projectManager', 'cmoProject', 'requestName'];
    const booleanLabels = ['pipelinable', 'analysisRequested'];
    
    let requester = {};
    labelValues.forEach((label) => {
        if (!(label in projectQc)) {
            requester[label] = 'N/A';
        } else {
            requester[label] = projectQc[label];
        }
    });

    booleanLabels.forEach((label) => {
        if (!(label in projectQc)) {
            requester[label] = false;
        } else {
            requester[label] = projectQc[label];
        }
    });

    if(!('requestedNumberOfReads' in sample)) {
        requester['requestedNumberOfReads'] = 'N/A';
    } else {
        requester['requestedNumberOfReads'] = sample['requestedNumberOfReads'];
    }

    return requester;
};

exports.enrichSamples = (samples) => {
    let sumReadsMap = {};
    let sumMtcMap = {};
    samples.forEach((sample)=> {
        const sampleQc = sample['qc'];
        const qcStatus = sampleQc['qcStatus'];
        if (qcStatus !== 'Failed' && qcStatus !== 'Failed-Reprocess') {
            if (sampleQc['readsExamined'] > 0) {
                sumReadsMap[sample['baseId']] = sampleQc['readsExamined'];
            } else {
                sumReadsMap[sample['baseId']] = sampleQc['unpairedReadsExamined'];
            }
        } 
    });
}
