import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import CompanyForm from './components/CompanyForm';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import RegisterForm from './components/Register';
import NavbarMain from './components/NavbarMain';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavbarMain />
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={RegisterForm} />
          <PrivateRoute exact path="/" component={CompanyList} />
          <PrivateRoute path="/companies/new" component={CompanyForm} />
          <PrivateRoute path="/companies/:companyName" component={CompanyDetail} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
