import { Card, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Eye } from 'react-bootstrap-icons';

export default function OngoingMeetingItem({ meeting }) {
  const history = useHistory();

  function Details() {
    return (
      <div style={{ height: 210 }}>
        <Card.Title className="Text__elipsized--1-line">
          {meeting.name}
        </Card.Title>
        <div className="Buffer--10px" />
        <Card.Subtitle>Ongoing</Card.Subtitle>
        <div className="Buffer--20px" />
        <Card.Text className="Text__elipsized--5-lines">
          {meeting.description}
        </Card.Text>
      </div>
    );
  }

  function Toggles() {
    return (
      <Row>
        <Col
          className="Toggle-card"
          onClick={() => history.push('/ongoing/' + meeting.id)}
        >
          <Eye />
          View
        </Col>
      </Row>
    );
  }

  return (
    <Col lg={4} md={6} sm={12} className="Container__padding--vertical-small">
      <Card style={{ height: 300 }} bg="primary" text="white">
        <Card.Body>
          <Details />
          <div
            className="Line--horizontal"
            style={{ backgroundColor: '#c5c5c5' }}
          />
          <div className="Buffer--5px" />
          <Toggles />
        </Card.Body>
      </Card>
    </Col>
  );
}
