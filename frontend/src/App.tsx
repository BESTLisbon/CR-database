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
import Invite from './components/Invite';
import AxiosInterceptorSetup from './components/AxiosInterceptorSetup';
import { AuthResponseType } from './models/auth';

const App: React.FC = () => {
  function canInvite(state: AuthResponseType | undefined) {
    if (state && state.user) {
      return state.user.role !== 'Member';
    }
    return false;
  }

  return (
    <AuthProvider>
      <Router>
        <AxiosInterceptorSetup />
        <NavbarMain />
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={RegisterForm} />
          <PrivateRoute
            condition={canInvite}
            redirectTo='/'
            path='/invite'
            component={Invite}
          />
          <PrivateRoute exact path='/' component={CompanyList} />
          <PrivateRoute path='/companies/new' component={CompanyForm} />
          <PrivateRoute
            path='/companies/:companyName'
            component={CompanyDetail}
          />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
