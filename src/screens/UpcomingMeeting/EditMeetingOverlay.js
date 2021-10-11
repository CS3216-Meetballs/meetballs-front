import { Offcanvas, Form, Button } from 'react-bootstrap';
import { useRef } from 'react';
import { accessTokenKey, apiUrl } from '../../common/CommonValues';

export default function EditMeetingOverlay({
  show,
  setShow,
  meeting,
  setMeeting,
}) {
  const nameRef = useRef();
  const descriptionRef = useRef();

  async function update() {
    const newMeeting = Object.assign({}, meeting);
    newMeeting.name = nameRef.current.value;
    newMeeting.description = descriptionRef.current.value;
    setMeeting(newMeeting);
    setShow(false);
    updateDatabase(newMeeting);
  }

  return (
    <Offcanvas show={show} onHide={() => setShow(false)}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit Meeting</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form.Group>
          <Form.Label column>Meeting Name</Form.Label>
          <Form.Control defaultValue={meeting.name} ref={nameRef} />
          <Form.Label column>Description</Form.Label>
          <Form.Control
            as="textarea"
            style={{ height: 200 }}
            defaultValue={meeting.description}
            ref={descriptionRef}
          />
        </Form.Group>
        <div className="Buffer--20px" />
        <div className="d-grid gap-2">
          <Button variant="secondary" onClick={update}>
            Update
          </Button>
          <div className="Buffer--20px" />
          <div className="Line--horizontal" />
          <div className="Buffer--20px" />
          <Button variant="outline-danger">Delete Meeting</Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

async function updateDatabase(newMeeting) {
  const url = apiUrl + '/meeting/' + newMeeting.id;
  const accessToken = window.sessionStorage.getItem(accessTokenKey);
  await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: newMeeting.name,
      description: newMeeting.description,
      duration: newMeeting.duration,
      enableTranscription: newMeeting.enableTranscription,
    }),
  });
}
