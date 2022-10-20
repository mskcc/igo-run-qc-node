import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/header';
import { getSeqAnalysisProjects } from './services/igo-qc-service';
import { HOME_PAGE, PROJECT_PAGE } from './resources/constants';
import { HomePage } from './components/homePage';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(HOME_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSeqAnalysisProjects();
      const dataRetrieved = response;
      setData(dataRetrieved);
    }

    fetchData()
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="App">
      <Router>
        <Header />
        <div className='body-container'>
          {page === HOME_PAGE ? 
            <HomePage/>
          :
            null
          }
        </div>
        {/* <p>{!data ? 'IGO App home page' : JSON.stringify(data)}</p> */}
      </Router>
      
    </div>
  );
}

export default App;
