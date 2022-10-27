import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './features/header';
import { HomePage } from './features/home/homePage';
import { ProjectPage } from './features/project/projectPage';
import config from './config';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="App">
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
          </Switch>
        </div>
        {/* <p>{!data ? 'IGO App home page' : JSON.stringify(data)}</p> */}
      </Router>
      
    </div>
  );
}

export default App;
