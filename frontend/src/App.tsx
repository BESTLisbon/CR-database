import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import CompanyForm from './components/CompanyForm';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import RegisterForm from './components/Register';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={RegisterForm} />
          <Route exact path="/" component={CompanyList} />
          <Route path="/companies/new" component={CompanyForm} />
          <Route path="/companies/:companyName" component={CompanyDetail} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
