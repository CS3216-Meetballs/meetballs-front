import './App.css';
import React, { useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import UpcomingMeetingScreen from './screens/UpcomingMeeting/UpcomingMeetingScreen';
import OngoingMeetingAdminScreen from './screens/OngoingMeetingAdmin.js/OngoingMeetingAdminScreen';
import DashboardScreen from './screens/Dashboard/DashboardScreen';
import EmailConfirmationScreen from './screens/Login/EmailConfirmationScreen';
import LoginScreen from './screens/Login/LoginScreen';
import RegistrationScreen from './screens/Login/RegistrationScreen';
import ForgotPasswordScreen from './screens/Login/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/Login/ResetPasswordScreen';
import { UserContext } from './context/UserContext';
import LandingScreen from './screens/LandingPage/LandingScreen';

export default function App() {
  const user = useContext(UserContext);

  useEffect(() => {
    console.log(`User is logged in ? ${user ? 'yes' : 'no'}`);
  }, []);

  /**
   * @param {JSX.Element} child
   * @returns
   */
  function RouteIfLoggedIn({ path, children }) {
    console.log(user ? 'user exists' : 'user not logged in');
    return <Route path={path}>{!user ? <Redirect to="/" /> : children}</Route>;
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingScreen />
        </Route>
        <Route path="/confirm-email">
          <EmailConfirmationScreen />
        </Route>
        <Route path="/login">
          <LoginScreen />
        </Route>
        <Route path="/forgot-password">
          <ForgotPasswordScreen />
        </Route>
        <Route path="/password-reset">
          <ResetPasswordScreen />
        </Route>
        <Route path="/signup">
          <RegistrationScreen />
        </Route>
        <RouteIfLoggedIn path="/home">
          <DashboardScreen />
        </RouteIfLoggedIn>
        <RouteIfLoggedIn path="/meeting/:id">
          <UpcomingMeetingScreen />
        </RouteIfLoggedIn>
        <RouteIfLoggedIn path="/ongoing/:id">
          <OngoingMeetingAdminScreen />
        </RouteIfLoggedIn>
        <Route path="*">
          <Redirect to={{ pathname: '/' }} />
        </Route>
      </Switch>
    </Router>
  );
}
