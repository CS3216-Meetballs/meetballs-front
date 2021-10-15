import { Container, Image } from 'react-bootstrap';
import ImageRedirect from '../assets/redirecting.jpg';

export default function RedirectionScreen({ message }) {
  const containerStyle = {
    paddingLeft: 30,
    paddingRight: 30,
    height: 'calc(100vh - 56px)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  };

  return (
    <Container style={containerStyle}>
      <Image src={ImageRedirect} style={{ width: '100%', maxWidth: 600 }} />
      <p style={{ fontSize: 25, fontWeight: 500 }}>{message}</p>
    </Container>
  );
}
