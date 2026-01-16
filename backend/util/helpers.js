exports.addProjectProperties = (project) => {
    let projectObj = Object.assign({}, project);
    const samples = projectObj.samples || [];
    const samplesONT = projectObj.samplesONT || [];
    
    let hasBasicQcs = false;
    
    projectObj.needsReview = false;
    projectObj.ready = false;
    projectObj.allRuns = '';
    projectObj.recentDate = 0;

    // Check if this is a Nanopore project - check requestType OR project recipe OR sample recipes
    const isNanopore = projectObj.requestType === 'Nanopore' || 
                       (projectObj.recipe && projectObj.recipe.toLowerCase().includes('nanopore')) ||
                       samples.some(s => s.recipe && s.recipe.toLowerCase().includes('nanopore'));
            

    // Process regular samples with basicQcs
    if (samples.length > 0) {
        // Only one sample needs to have a non-empty 'basicQcs' field for the project to be considered ready
        for (let i = 0; i < samples.length; i++) {
            let sample = samples[i];
            // Regular samples have basicQcs array
            if (sample.basicQcs && sample.basicQcs.length > 0) {
                hasBasicQcs = true;
                projectObj.ready = true;
                
                // Based on the basicQcs::qcStatus of each sample. Only one sample in the project needs to be under-review to be un-reviewed
                for(let j = 0; j < sample.basicQcs.length; j++) {
                    let qc = sample.basicQcs[j];
                    if (qc.qcStatus === 'Under-Review') {
                        projectObj.needsReview = true;
                    }
                    if (qc.run) {
                        const splitString = qc.run.split('_');
                        let trimmedRun = `${splitString[0]}_${splitString[1]}`;
                        const runs = projectObj.allRuns;
                        if (runs.length === 0) {
                            projectObj.allRuns = trimmedRun;
                        } else if (!runs.includes(trimmedRun)) {
                            projectObj.allRuns = projectObj.allRuns.concat(`, ${trimmedRun}`);
                        }
                    }          
                    let numericDate = projectObj.recentDate;
                    if (qc.createDate > projectObj.recentDate) {
                        numericDate = qc.createDate;
                    }
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
    
    // Nanopore/ONT projects - check samplesONT for QC status
    // samplesONT is fetched separately via getProjectQc API in HomePageController
    if (isNanopore && !hasBasicQcs) {
        projectObj.ready = true;
        
        // Set placeholder values so columns appear in frontend grid
        projectObj.allRuns = ' ';           // Single space - truthy but displays empty
        projectObj.date = ' ';              // Single space - truthy but displays empty
        projectObj.project_flags = {};      // Empty object - shows "No data" icon
        
        if (samplesONT.length > 0) {
            // Check actual QC status from samplesONT
            // Only mark as needsReview if at least one sample is "Under-Review"
            for (let i = 0; i < samplesONT.length; i++) {
                let sampleONT = samplesONT[i];
                if (sampleONT.qcStatus === 'Under-Review') {
                    projectObj.needsReview = true;
                    break; // Found one, no need to continue
                }
            }
            // If no samples are Under-Review, needsReview stays false
            // and project goes to "Requires Further Sequencing"
        }
        // If no samplesONT data available AND samples array is empty,
        // don't mark as needsReview - there's nothing to review
        // Project will go to "Requires Further Sequencing"
    }
    
    // Ensure projects that need review are marked as ready
    if (projectObj.needsReview) {
        projectObj.ready = true;
    }
    
    return projectObj;
};


// based on old version - not currently used
// exports.getProjectInfo = (projectQc, projectStatusList) => {
//     const samples = projectQc.samples;
//     const commonSample = samples[0];
//     let requester = this.getRequesterInfo(projectQc, commonSample);
//     let statuses = {};
//     let recordIds = [];
//     // getStatuses, getRecordIds, enrichSamples, and some of getRequesterInfo all loop through samples
//     // move that logic into here for better efficiency!

//     let sampleNames = [];
//     let tumorCount = 0;
//     let normalCount = 0;
//     let labels = [];
//     let enrichedSamples = [];

//     for(let i = 0; i < projectStatusList.length; i++) {
//         statuses[i] = 0;
//     }
//     samples.forEach((sample) => {
//         let sampleQC = sample['qc'];
//         let name = sampleQC['sampleName'];
//         recordIds.push(sampleQC['recordId']);

//         if(!sampleNames.includes(name)) {
//             sampleNames.push(name);
//             if(sample['tumorOrNormal'] === 'Tumor') {
//                 tumorCount++;
//             } else if(sample['tumorOrNormal'] === 'Normal') {
//                 normalCount++;
//             }
//         }

//         // statuses: Double check this is right... idk
//         if(!(sampleQC['recordId'] in labels)) {
//             if(!('qcStatus' in sampleQC)){
//                 labels.push(sampleQC['recordId']);
//             } else {
//                 statuses[sampleQC['qcStatus']] += 1;
//             }
//         }

//         // enriching done in separate function for readability

//     });

//     // rest of requester info
//     requester['tumorCount'] = tumorCount;
//     requester['normalCount'] = normalCount;
//     if(!('sampleNumber' in projectQc)) {
//         requester['numSamples'] = sampleNames.length;
//     } else {
//         requester['numSamples'] = projectQc['sampleNumber'];
//     }

//     const projectInfo = {
//         'requester': requester,
//         'statuses': statuses,
//         'recordIds': recordIds
//     };
    
//     return projectInfo;
//     // separate functions: getChartLinks, getProjectType, grid(find js equivalent)

// };


exports.enrichProjectQC = (projectQc) => {
    const samples = projectQc.samples;
    let sampleNames = [];
    let tumorCount = 0;
    let normalCount = 0;

    samples.forEach((sample) => {
        let sampleQC = sample['qc'];
        let name = sampleQC['sampleName'];
        if(!sampleNames.includes(name)) {
            sampleNames.push(name);
            if(sample['tumorOrNormal'] === 'Tumor') {
                tumorCount++;
            } else if(sample['tumorOrNormal'] === 'Normal') {
                normalCount++;
            }
        }
    });

    return {
        ...projectQc,
        tumorCount: tumorCount,
        normalCount: normalCount
    };
};


exports.enrichSampleInfo = (samples) => {
    const sampleReadsHash = {};
    const sampleMTCHash = {};
    let enrichedSamples = samples;
    enrichedSamples.forEach((sample)=> {
        const sampleQc = sample['qc'];
        const qcStatus = sampleQc['qcStatus'];
        if (qcStatus !== 'Failed' && qcStatus !== 'Failed-Reprocess') {
            
            // set sumReads
            if (sampleReadsHash[sample.baseId]) {
                // update hash
                const newSum = sampleReadsHash[sample.baseId] + sampleQc['readsExamined'] + sampleQc['unpairedReadsExamined'];
                sampleReadsHash[sample.baseId] = newSum;
            } else {
                // set sample reads in hash
                sampleReadsHash[sample.baseId] = sampleQc['readsExamined'] + sampleQc['unpairedReadsExamined'];
            }

            // set meantargetcoverage
            const targetCoverage = sample['recipe'] === 'WGS_Deep' ? 'mean_COVERAGE' : 'meanTargetCoverage';
            if (sampleMTCHash[sample.baseId]) {
                const newSum = sampleMTCHash[sample.baseId] + sampleQc[targetCoverage];
                sampleMTCHash[sample.baseId] = newSum;
            } else {
                sampleMTCHash[sample.baseId] = sampleQc[targetCoverage];
            }
        } 
    });

    // unfortunately have to loop through again
    enrichedSamples.forEach(sample => {
        sample['sumReads'] = sampleReadsHash[sample.baseId];
        sample['sumMTC'] = sampleMTCHash[sample.baseId];
    });

    return enrichedSamples;
};