import React, { useState, useEffect } from 'react';
import { getInterOpsData } from '../../services/igo-qc-service';
import { GoGraph } from 'react-icons/go';

export const InterOpsDataPage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const runId = queryParams.get('runId');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const response = await getInterOpsData(runId);
          const runInterOpsData = response.data ? response.data.interOpsData : 'No Data Retrieved.';
 
          setData(runInterOpsData);
        };
    
        fetchData().catch(error => console.log(error));

      }, [runId, setData]);

    return (
        <div>
    <div className='run-summary'>
    <h3 className='title'><span><GoGraph /></span> Run Summary</h3>
    <div>
        <table className='project-table border-collapse fill-width'>
           <thead>
           <tr className='fill-width'>
               <th className='light-blue-border' scope='col'>Run ID</th>
               <th className='light-blue-border' scope='col'>Read</th>
               <th className='light-blue-border' scope='col'>Lane</th>
               <th className='light-blue-border' scope='col'>Cluster PF(%)</th>
               <th className='light-blue-border' scope='col'>Cluster PF Stddev</th>
               <th className='light-blue-border' scope='col'>Reads(M)</th>
               <th className='light-blue-border' scope='col'>Rads PF(M)</th>
               <th className='light-blue-border' scope='col'>{'% >= Q30'}</th>
               <th className='light-blue-border' scope='col'>Aligned %</th>
               <th className='light-blue-border' scope='col'>Aligned % Stddev</th>
               <th className='light-blue-border' scope='col'>Error Rate(%)</th>
               <th className='light-blue-border' scope='col'>Error Rate Stddev</th>
               <th className='light-blue-border' scope='col'>Density</th>
               <th className='light-blue-border' scope='col'>Density Stddev</th>
               <th className='light-blue-border' scope='col'>Avg. Percent Occupied(%)</th>
           </tr>
           </thead>
            <tbody id='runSummaryTableBody'>
            
            {data.map((row, index) => {
                return (
                    <tr>
                <td className='text-align-center light-blue-border' key={`${row.i_Run}-${index}`}>{row.i_Run}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Read}-${index}`}>{row.i_Read}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Lane}-${index}`}>{row.i_Lane}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_ClusterPF}-${index}`}>{row.i_ClusterPF}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_ClusterPF_stddev}-${index}`}>{row.i_ClusterPF_stddev}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_ReadsM}-${index}`}>{row.i_ReadsM}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_ReadsPFM}-${index}`}>{row.i_ReadsPFM}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Q30}-${index}`}>{row.i_Q30}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Aligned}-${index}`}>{row.i_Aligned}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Aligned_stddev}-${index}`}>{row.i_Aligned_stddev}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_ErrorRate}-${index}`}>{row.i_ErrorRate}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Errorrate_stddev}-${index}`}>{row.i_Errorrate_stddev}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Density}-${index}`}>{row.i_Density}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Density_stddev}-${index}`}>{row.i_Density_stddev}</td>
                <td className='text-align-center light-blue-border' key={`${row.i_Percent_Occupied}-${index}`}>{row.i_Percent_Occupied}</td>
             </tr>
                );
            })
             }
            
            </tbody>
            </table>
    </div>
  </div>
</div>
    );
};

export default InterOpsDataPage;
