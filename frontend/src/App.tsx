import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import CompanyForm from './components/CompanyForm';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={CompanyList} />
        <Route path="/companies/new" component={CompanyForm} />
        <Route path="/companies/:companyName" component={CompanyDetail} />
      </Switch>
    </Router>
  );
}

export default App;
