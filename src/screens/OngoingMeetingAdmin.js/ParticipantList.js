import { Card, Col, Button } from 'react-bootstrap';
import {
  markParticipantPresent,
  markParticipantAbsent,
} from '../../services/participants';

export default function ParticipantList({
  meeting,
  setMeeting,
  position,
  shouldShowButton,
}) {
  const items = [];
  const participants = meeting.participants;
  const ended = position >= meeting.agendaItems.length;
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].timeJoined != null) {
      items.push(
        <PresentItem
          meeting={meeting}
          setMeeting={setMeeting}
          position={i}
          showButton={!ended && shouldShowButton}
          key={'Participant' + i}
        />,
      );
    } else {
      items.push(
        <AwaitItem
          meeting={meeting}
          setMeeting={setMeeting}
          position={i}
          started={position >= 0}
          showButton={!ended && shouldShowButton}
          key={'Participant' + i}
        />,
      );
    }
  }
  return items;
}

function AwaitItem({ meeting, setMeeting, position, started, showButton }) {
  const participant = meeting.participants[position];
  return (
    <Col className="Container__padding--vertical-small">
      <Card bg={started ? 'danger' : 'light'} text={started ? 'light' : 'dark'}>
        <Card.Body>
          <Card.Title>
            {participant.userName != null && participant.userName.length > 0
              ? participant.userName
              : 'Guest'}
          </Card.Title>
          <Card.Text>{participant.userEmail}</Card.Text>
          {showButton && (
            <div className="d-grid gap-2">
              <Button
                variant={started ? 'outline-light' : 'outline-secondary'}
                onClick={() => markPresent(meeting, setMeeting, position)}
              >
                Mark as Present
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

function PresentItem({ meeting, setMeeting, position, showButton }) {
  const participant = meeting.participants[position];
  return (
    <Col className="Container__padding--vertical-small">
      <Card bg="success" text="light">
        <Card.Body>
          <Card.Title>
            {participant.userName != null && participant.userName.length > 0
              ? participant.userName
              : 'Guest'}
          </Card.Title>
          <Card.Text>{participant.userEmail}</Card.Text>
          {showButton && (
            <div className="d-grid gap-2">
              <Button
                variant="outline-light"
                onClick={() => unmarkPresent(meeting, setMeeting, position)}
              >
                Mark as Absent
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

async function markPresent(meeting, setMeeting, position) {
  try {
    await markParticipantPresent(
      meeting.id,
      meeting.participants[position].userEmail,
    );
    const newMeeting = Object.assign({}, meeting);
    newMeeting.participants[position].timeJoined = new Date().toISOString();
    setMeeting(meeting);
    updateStatus(meeting, position, true);
  } catch (error) {
    console.log(error);
  }
}

async function unmarkPresent(meeting, setMeeting, position) {
  try {
    await markParticipantAbsent(
      meeting.id,
      meeting.participants[position].userEmail,
    );
    const newMeeting = Object.assign({}, meeting);
    newMeeting.participants[position].timeJoined = null;
    setMeeting(meeting);
    updateStatus(meeting, position, false);
  } catch (error) {
    console.log(error);
  }
}

function updateStatus(meeting, position, isPresent) {}
