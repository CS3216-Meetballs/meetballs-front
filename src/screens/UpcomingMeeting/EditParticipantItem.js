import { useState } from 'react';
import { isNil } from 'lodash';
import { Button, Row, Col, Card, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import { extractError } from '../../utils/extractError';

export default function EditParticipantItem({
  setEditing,
  setMeeting,
  meeting,
  position,
}) {
  const participant = meeting.participants[position];
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(participant.userEmail);
  const [username, setUsername] = useState(participant.userName);

  const checkForDuplicate = () => {
    return !isNil(
      meeting.participants.find(
        (participant) => participant.userEmail === email,
      ),
    );
  };

  function syncAgenda(prevParticipantId) {
    setMeeting((meeting) => ({
      ...meeting,
      agendaItems: meeting.agendaItems.map((item) => {
        if (item?.speaker?.id === prevParticipantId) {
          item.speaker = null;
        }
        return item;
      }),
    }));
  }

  async function updateChanges() {
    if (email.length === 0) {
      toast.error('Email must not be empty.');
      return;
    }
    if (username.length === 0) {
      toast.error('Name must not be empty.');
      return;
    }

    if (participant.userName === username && participant.userEmail === email) {
      setEditing(false);
      return;
    }

    if (participant.userName === username && checkForDuplicate()) {
      toast.error(`Participant with email ${email} already exist`);
      return;
    }
    const oldEmail = meeting.participants[position].userEmail;
    const oldId = meeting.participants[position]?.id;
    try {
      setLoading(true);
      const newParticipant = await updateDatabase(
        meeting.id,
        email,
        username,
        oldEmail,
      );
      meeting.participants[position] = newParticipant;
      syncAgenda(oldId);
      setEditing(false);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  }

  function close() {
    const oldEmail = meeting.participants[position].userEmail;
    if (oldEmail === '') {
      const newMeeting = Object.assign({}, meeting);
      const newParticipants = newMeeting.participants;
      newParticipants.splice(position, 1);
      newMeeting.participants = newParticipants;
      setMeeting(newMeeting);
    } else {
      setEditing(false);
    }
  }

  return (
    <Col className="Container__padding--vertical-small">
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card>
          <Card.Header>
            <p className="Text__card-header">Editing Participant</p>
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Label column>Name</Form.Label>
              <Form.Control
                defaultValue={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <Form.Label column>Email</Form.Label>
              <Form.Control
                defaultValue={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <div className="Buffer--20px" />
              <Row>
                <Col>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" onClick={close}>
                      Cancel
                    </Button>
                  </div>
                </Col>
                <Col>
                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={updateChanges}>
                      Confirm
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form.Group>
          </Card.Body>
        </Card>
      )}
    </Col>
  );
}

async function updateDatabase(meetingId, newEmail, newUsername, oldEmail) {
  if (oldEmail.length !== 0) {
    await server.delete('/participant', {
      data: {
        participants: [{ userEmail: oldEmail }],
        meetingId: meetingId,
      },
      ...defaultHeaders,
    });
  }
  const result = await server.post(
    '/participant',
    {
      meetingId: meetingId,
      userEmail: newEmail,
      userName: newUsername,
    },
    defaultHeaders,
  );
  return result.data;
}
