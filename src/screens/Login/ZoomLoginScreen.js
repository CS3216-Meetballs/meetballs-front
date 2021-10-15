import { Col, Row, Image, Button } from 'react-bootstrap';
import LoginImage from '../../assets/login.jpg';
import { zoomClientId, zoomRedirectUrl } from '../../common/CommonValues';

export default function ZoomLoginScreen() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: zoomClientId,
    redirect_uri: zoomRedirectUrl,
  });

  return (
    <Row style={{ marginLeft: 0, marginRight: 0 }}>
      <Col
        sm={12}
        md={12}
        lg={8}
        style={{ paddingLeft: 0, paddingRight: 0 }}
        className="d-none d-lg-block"
      >
        <Image
          src={LoginImage}
          style={{
            height: 'calc(100vh - 56px)',
            width: '100%',
            objectFit: 'cover',
          }}
        />
      </Col>
      <Col
        sm={12}
        md={12}
        lg={4}
        style={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <div
          className=" Container__padding--vertical"
          style={{
            paddingLeft: 40,
            paddingRight: 40,
            height: 'calc(100vh - 56px)',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <p className="Text__header">Get the ball rolling</p>
          <p className="Text__subheader">with MeetBalls</p>
          <Button
            variant="zoom"
            style={{ width: 200 }}
            href={`https://zoom.us/oauth/authorize?${params.toString()}`}
          >
            Login With Zoom
          </Button>
        </div>
      </Col>
    </Row>
  );
}
