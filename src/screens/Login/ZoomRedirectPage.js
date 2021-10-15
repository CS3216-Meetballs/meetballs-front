import { useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import RedirectionScreen from '../../components/RedirectionScreen';
import { UserContext } from '../../context/UserContext';
import { zoomLogin } from '../../services/auth';

const CODE_PARAM_KEY = 'code';

const MESSAGE = 'Please hold on while we log you in.';

export default function ZoomRedirectPage() {
  const { search } = useLocation();
  const user = useContext(UserContext);
  const history = useHistory();
  const query = new URLSearchParams(search);
  const code = query.get(CODE_PARAM_KEY);

  useEffect(() => {
    if (!code) {
      history.push('/login');
      return;
    }
    zoomLogin(code)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(code);
        history.push('/login');
      });
  }, []);

  useEffect(() => {
    if (user) {
      history.push('/home');
    }
  }, [user]);

  return <RedirectionScreen message={MESSAGE} />;
}
