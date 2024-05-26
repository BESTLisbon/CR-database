import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail'; // Create this component for showing company details

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={CompanyList} />
        <Route path="/companies/:companyName" component={CompanyDetail} />
      </Switch>
    </Router>
  );
}

export default App;
