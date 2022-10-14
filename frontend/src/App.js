import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/header';
import { getSeqAnalysisProjects } from './services/igo-qc-service';

function App() {
  const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   getSeqAnalysisProjects
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div className="App">
      <Router>
        <Header />
        <p>{!data ? 'IGO App home page' : data}</p>
        {/* <Switch>
          <Route path='/' component={HomePage} />
        </Switch> */}
      </Router>
      
    </div>
  );
}

export default App;
