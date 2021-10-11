import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Navbar, Image, Button } from 'react-bootstrap';
import Logo from '../assets/logo.png';
import { useHistory } from 'react-router';
import setAuthToken from '../utils/setAuthToken';

export const AppNavbar = ({ showButton = true, buttonType = 'dashboard' }) => {
  const user = useContext(UserContext);
  const history = useHistory();

  function logout() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    setAuthToken(null);
    history.replace('/login');
  }

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="Container__fixed-header .navbar-text"
    >
      <Container>
        <Navbar.Brand
          style={{ alignItems: 'center', display: 'flex', cursor: 'pointer' }}
          onClick={() => history.push('/')}
        >
          <Image src={Logo} style={{ width: 30, height: 30 }} />
          <Navbar.Text style={{ padding: '0px 10px' }} className="Text__logo">
            Meetballs
          </Navbar.Text>
        </Navbar.Brand>
        {showButton && !user ? (
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ borderRadius: 50 }}
            onClick={() => history.push('/login')}
          >
            Login
          </Button>
        ) : showButton && buttonType === 'dashboard' ? (
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ borderRadius: 50 }}
            onClick={() => history.push('/home')}
          >
            Dashboard
          </Button>
        ) : showButton && buttonType === 'logout' ? (
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ borderRadius: 50 }}
            onClick={logout}
          >
            Logout
          </Button>
        ) : null}
      </Container>
    </Navbar>
  );
};
