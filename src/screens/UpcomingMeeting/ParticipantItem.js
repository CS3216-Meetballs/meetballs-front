import { Button, Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';
import { accessTokenKey, apiUrl } from '../../common/CommonValues';
import EditParticipantItem from './EditParticipantItem';

export default function ParticipantItem({ setMeeting, meeting, position }) {
  const [editing, setEditing] = useState(false);
  const participant = meeting.participants[position];

  if (!editing && participant.userEmail.length === 0) {
    setEditing(true);
  }

  async function removeParticipant() {
    const newMeeting = Object.assign({}, meeting);
    const newParticipants = newMeeting.participants;
    const email = newParticipants[position].userEmail;
    newParticipants.splice(position, 1);
    newMeeting.participants = newParticipants;
    await removeFromDatabase(email, meeting.id);
    setMeeting(newMeeting);
  }

  if (editing) {
    // Editing
    return (
      <EditParticipantItem
        setEditing={setEditing}
        setMeeting={setMeeting}
        meeting={meeting}
        position={position}
        removeParticipant={removeParticipant}
      />
    );
  }
  // Not editing
  return (
    <Col className="Container__padding--vertical-small">
      <Card bg="light">
        <Card.Body>
          <Card.Title>
            {participant.userName != null && participant.userName.length > 0
              ? participant.userName
              : 'Guest'}
          </Card.Title>
          <Card.Text>{participant.userEmail}</Card.Text>
          <Row>
            <Col>
              <div className="d-grid gap-2">
                <Button variant="outline-danger" onClick={removeParticipant}>
                  Remove
                </Button>
              </div>
            </Col>
            <Col>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

async function removeFromDatabase(email, meetingId) {
  const url = apiUrl + '/participant';
  const accessToken = window.sessionStorage.getItem(accessTokenKey);
  await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participants: [{ userEmail: email }],
      meetingId: meetingId,
    }),
  });
}
