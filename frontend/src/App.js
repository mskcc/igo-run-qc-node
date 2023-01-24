import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './features/header';
import { HomePage } from './features/home/homePage';
import { ProjectPage } from './features/project/projectPage';
import InterOpsDataPage from './features/interOpsData/interOpsDataPage';
import FingerprintingTable from './features/project/fingerprinting';
import config from './config';

function App() {
  return (
    <div id='App' className='App'>
      <Router basename={config.BASENAME}>
        <Header />
        <div className='body-container'>
          <Switch>
            <Route exact path='/'>
              <HomePage />
            </Route>
            <Route exact path='/projects/:projectId'>
              <ProjectPage />
            </Route>
            <Route exact path='/getInterOpsData'>
              <InterOpsDataPage />
            </Route>
            <Route exact path='/projects/fingerprinting/:projectId'>
              <FingerprintingTable />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
