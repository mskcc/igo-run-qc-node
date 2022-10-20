import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './features/header';
import { HOME_PAGE, PROJECT_PAGE } from './resources/constants';
import { HomePage } from './features/home/homePage';
import { connect } from 'react-redux';
import * as homePageActions from './redux/actions/homePageActions';

function App({state, dispatch}) {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(HOME_PAGE);

  // useEffect(() => {
  //   dispatch.fetchSeqAnalysisData()
  //     .catch(error => console.error(error));
  // }, []);

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

// const mapStateToProps = (state) => ({
//   ...state
// });
// const mapDispatchToProps = {
//   ...homePageActions
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
