import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import RedirectionScreen from '../../components/RedirectionScreen';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';

const TOKEN_KEY = 'token';

const LOADING_MSG = 'Please hold on while we verify your link.';
const ERROR_MSG =
  'Error! Your link is invalid! Please contact your meeting host for a new link.';

export default function RedirectScreen() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get(TOKEN_KEY);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const history = useHistory();

  useEffect(async () => {
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await server.get(
        `/meeting/magic-link/${token}`,
        defaultHeaders,
      );
      setError(false);
      const id = response.data?.meeting?.id;
      setLoading(false);
      history.push(`/ongoing/${id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true);
    }
  }, []);

  const message = loading && error ? ERROR_MSG : LOADING_MSG;

  return <RedirectionScreen message={message} />;
}
