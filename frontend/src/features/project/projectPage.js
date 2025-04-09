/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Card } from '../common/card';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FaDna } from 'react-icons/fa';
import { TiDownload } from 'react-icons/ti';
import { getProjectQC, getCrosscheckMetrics } from '../../services/igo-qc-service';
import {
  setProjectQCData,
  selectProjectDataById,
  setProjectCrosscheckMetrics,
  selectProjectCrosscheckMetricsById,
} from './projectSlice';
import { QcTable } from './qcTable';
import { AdditionalColumnsModal } from '../common/additionalColumnsModal';
import { PED_PEG, NANOPORE, TABLE_HEADERS, ADDITIONAL_10X_TABLE_HEADERS, INVESTIGATOR_PREP_LIB, NANOPORE_HEADERS } from '../../resources/constants';
import {
  mapColumnsToHideByRecipe,
  orderSampleQcData,
  getProjectType,
  orderDataWith10XColumns,
  orderONTData
} from '../../resources/projectHelper';
import { downloadExcel } from '../../utils/other-utils';
import config from '../../config';
import { downloadNgsStatsFile, mapCellRangerRecipe, getCellRangerData } from '../../services/ngs-stats-service';

export const ProjectPage = () => {
  const { projectId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [cellRangerError, setCellRangerError] = useState('');
  const [dataColumnsToHide, setDataColumnsToHide] = useState([]);
  const [tableHeaders, setTableHeaders] = useState(TABLE_HEADERS);
  const [orderedSampleInfo, setOrderedSampleInfo] = useState([]);
  const [showWebSummaries, setShowWebSummaries] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [qualityCheckStatus, setQualityCheckStatus] = useState('button-disabled');
  const [recipeTypes, setRecipeTypes] = useState('');
  const [is10xProject, setIs10xProject] = useState(false);

  const selectProjectData = useSelector(state =>
    selectProjectDataById(state, projectId)
  );
  const selectCrosscheckMetricsData = useSelector(state => 
    selectProjectCrosscheckMetricsById(state, projectId)
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await getProjectQC(projectId);
      if (response.status === 500) {
        setErrorMessage(response.message);
      } else {
        setErrorMessage('');
        const { projectQc } = response.data;
        dispatch(setProjectQCData(projectQc, projectId));

      }
      setIsLoading(false);
    };

    if (!selectProjectData) {
      setIsLoading(true);
      fetchData().catch(error => console.log(error));
    } else {
      setIsLoading(false);
      setProjectData(selectProjectData);
      setErrorMessage('');
      handleProjectDetails(selectProjectData);
    }
  },[selectProjectData, projectId, dispatch]);

  // load cell ranger data if 10x project
  useEffect(() => {
    const fetch10XData = async (recipeToUse) => {
      const response = await getCellRangerData(projectData.requestId, recipeToUse);
      if (!response.cellRangerSampleResults) {
        setCellRangerError('No Cell Ranger results found.');
      } else {
        const { data } = response.cellRangerSampleResults;
        if (orderedSampleInfo.length) {
          const allOrderedInfo = orderDataWith10XColumns(orderedSampleInfo, data);
          setOrderedSampleInfo(allOrderedInfo);
        }
        
      }
    };
    if(is10xProject) {
      const recipeToUse = mapCellRangerRecipe(recipeTypes);
      fetch10XData(recipeToUse);
    }
  }, [is10xProject]);

  // Quality Checks - fingerprinting info
  useEffect(() => {
    const fetchCrosscheckMetrics = async () => {
      const response = await getCrosscheckMetrics(projectId);
      const metricsData = response.data && response.data.metricsData ? response.data.metricsData[projectId] : {};
      dispatch(setProjectCrosscheckMetrics(metricsData, projectId));
    };

    if (!selectCrosscheckMetricsData) {
      fetchCrosscheckMetrics().catch(error => console.log(error));      
    } else {
      // setting quality checks button color based on results from crosscheck metrics
      if (selectCrosscheckMetricsData.flag) {
        setQualityCheckStatus(selectCrosscheckMetricsData.flag);
      }
    }
  }, [projectId, selectCrosscheckMetricsData, dispatch]);

  const handleProjectDetails = (data) => {
    if(data.samplesONT&&data.samplesONT.length>0){
      let recipe = data.samplesONT[0].recipe;
      console.log("ont recipe before assignment is: ", recipe);
      console.log("ONT sample recipe is: ", recipe, " ONT sample record ID is: ", data.samplesONT[0].recordId);
      console.log("Detected Nanopore data in samplesONT:",data.samplesONT);
      console.log("data.requestName = ", data.requestName);
      if (data.requestName === NANOPORE) {
          recipe = NANOPORE;
      }
      setTableHeaders(NANOPORE_HEADERS);
     const sampleData =orderONTData(data.samplesONT);
     console.log("Processed Nanopore data in samplesONT:",orderONTData);
     setOrderedSampleInfo(sampleData);
    }
    else if (data.samples && data.samples.length > 0) {
      let recipe = data.samples[0].recipe;
      console.log("Detected data in sample:",data.samples);
      if (data.requestName === PED_PEG) {
          recipe = PED_PEG;
      }
      if (data.requestName === INVESTIGATOR_PREP_LIB) {
        recipe = INVESTIGATOR_PREP_LIB;
      }

      //TODO make this nested if better
      if (recipe.includes('SC_Chromium')) {
        const recipes = getProjectType(data.samples);
        setRecipeTypes(recipes);
        if (mapCellRangerRecipe(recipes)) {
          setIs10xProject(true);
          const allHeaders = tableHeaders.concat(ADDITIONAL_10X_TABLE_HEADERS);
          setTableHeaders(allHeaders);
          const columnsToHide = mapColumnsToHideByRecipe(recipe, allHeaders);
          setDataColumnsToHide(columnsToHide);
        } else {
          const columnsToHide = mapColumnsToHideByRecipe(recipe, tableHeaders);
          setDataColumnsToHide(columnsToHide);
        }
      } else {
        const columnsToHide = mapColumnsToHideByRecipe(recipe, tableHeaders);
        setDataColumnsToHide(columnsToHide);
      }
      
      const sampleData = orderSampleQcData(data.samples);
      setOrderedSampleInfo(sampleData);

    }
  };

  // ACTION BUTTONS
  const handleColumnModalClose = () => {
    setIsColumnModalOpen(false);
  };
  const handleColumnModalOpen = () => {
    setIsColumnModalOpen(true);
  };
  const handleSetColumns = (columnNames) => {
    let columnIndicesToAdd = [];
    columnNames.forEach(header => {
      columnIndicesToAdd.push(tableHeaders.indexOf(header));
    });
    setDataColumnsToHide(columnIndicesToAdd);
  };

  const handleWebSummaryClick = () => {
    setShowWebSummaries(!showWebSummaries);
  };

  const downloadWebSummary = (row) => {
    const cellRangerRecipe = mapCellRangerRecipe(row.recipe);
    downloadNgsStatsFile(cellRangerRecipe, row.qc.sampleName, row.baseId, projectData.requestId, row.qc.run)
      .then((data) => {
        if (!data) {
          // TODO add error UI messaging
          // alert(`Data not available for ${row.qc.sampleName}.`);
        }
      });
  };

  const handleQualityCheckClick = () => {
    if(projectData.samplesONT && projectData.samplesONT.length>0){
      return;
    }
    history.push(`/projects/fingerprinting/${projectId}`);
  };

  return (
    <Card>
      <AdditionalColumnsModal isOpen={isColumnModalOpen} onModalClose={handleColumnModalClose} setColumns={handleSetColumns} allColumns={tableHeaders} hiddenColumns={dataColumnsToHide} />
      <div className='project-title'>
        <h2 className={'title text-align-center'}>Project {projectId} Details</h2>
      </div>

      {errorMessage || !projectData || projectData.length === 0 ?
        <div className='text-align-center error-message'>{errorMessage}</div>
      :
      <div className='project-info-container'>
        <div className='project-flexbox-container'>
          <div className='project-request-details'>
            <div className='project-info-data'>
              <span className='info-bold'>Investigator: </span>{projectData.investigator}
            </div>
            <div className='project-info-data'>
              <span className='info-bold'>PI: </span>{projectData.pi}
            </div>
            <div className='project-info-data'>
              <span className='info-bold'>Project ID: </span>{projectData.requestId}
            </div>
            <div className='project-info-data'>
              <span className='info-bold'>Request Name: </span>{projectData.requestName}
            </div>
            <div className='project-info-data'>
              <span className='info-bold'>Number of Samples: </span>{projectData.sampleNumber}
            </div>
            <div className='project-info-data'>
              <span className='info-bold'>Tumor Count: </span>{projectData.tumorCount}
            </div>
            <div className='project-info-data'>
              <span className='info-bold'>Normal Count: </span>{projectData.normalCount}
            </div>
          </div>
          <div className='project-actions'>
            <div className='download-stats-container'>
              <div onClick={() => downloadExcel(orderedSampleInfo, tableHeaders, projectId)} className={'em5 download-stats'} role='button' aria-label='Excel Download' aria-hidden='false'>
                <SiMicrosoftexcel />
              </div>
              <a href={`${config.NGS_STATS}/ngs-stats/get-picard-project-excel/${projectId}`} target='_blank' className={'em5 download-stats'} title='Full Picard Stats' rel='noreferrer'>
                <FaDna />
              </a>
            </div>
            <div className={showWebSummaries ? 'actions-popup' : 'hidden'}>
              {showWebSummaries ? (
                projectData.samples.map((sample, index) => {
                  const summaryName = `${sample.qc.sampleName}_IGO_${sample.baseId}`;
                  return <div key={index}>
                    <div onClick={() => downloadWebSummary(sample)} className={'download-stats'}>
                      <span>{summaryName} </span><TiDownload />
                    </div>
                  </div>;
                })
              )
              : ''
              }
            </div>
            <div onClick={handleWebSummaryClick} className={showWebSummaries ? 'additional-actions action-button-clicked' : 'additional-actions'}>Web Summaries</div>
            <div onClick={handleQualityCheckClick} className={`additional-actions ${qualityCheckStatus}`}>Quality Checks</div>
            <div onClick={handleColumnModalOpen} className='additional-actions'>Set Columns</div>
          </div>
        </div>
        {cellRangerError && (
          <div className='text-align-center'>{cellRangerError}</div>
        )}
        <div className='hottable-container'>
          {isLoading ? 
            <div className="dot-elastic"></div>
            : <QcTable qcSamplesData={orderedSampleInfo} columnsToHide={dataColumnsToHide} tableHeaders={tableHeaders} recipe={recipeTypes} />
          }
        </div>
      </div>
      }
    </Card>
  );
};
