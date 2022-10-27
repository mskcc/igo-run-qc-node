import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectQC } from '../../services/igo-qc-service';
import { setProjectQCData, selectProjectDataById } from './projectSlice';

export const ProjectPage = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const [projectData, setProjectData] = useState();
    const selectProjectData = useSelector((state) => selectProjectDataById(state, projectId));

    useEffect(() => {
        const fetchData = async () => {
            const response = await getProjectQC(projectId);
            const { projectQc } = response.data;
            dispatch(setProjectQCData(projectQc, projectId));
        }

        if (!selectProjectData) {
            fetchData().catch(error => console.log(error));
        } else {
            setProjectData(selectProjectData);
        }
    });
    
    return (
        <div>
            {projectData ? JSON.stringify(projectData) : 'Project page!'}
        </div>
    );
}
