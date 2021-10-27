import { useEffect, useState } from "react";
import { Card, Button, Form, Modal, ListGroup, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { extractError } from "../../../utils/extractError";
import { createParticipants } from "../../../services/participants";

export default function AddParticipantsModal({
  show,
  setShow,
  candidates,
  meeting,
  setMeeting
}) {
  const [emailSet, setEmailSet] = useState(new Set());
  const [newCandidates, setNewCandidates] = useState([]);
  const [dupeCandidates, setDupeCandidates] = useState([]);
  
  useEffect(() => {
    const existingEmails = meeting.participants.map((p) => p.userEmail);
    const set = new Set(existingEmails);
    setEmailSet(set);

    const eligibleUsers = candidates.filter((p) => !emailSet.has(p.userEmail));
    const ineligibleUsers = candidates.filter((p) => emailSet.has(p.userEmail));
    setNewCandidates(eligibleUsers);
    setDupeCandidates(ineligibleUsers);
  }, [show]);

  function CandidateItem({ candidate }) {
    return (
      <ListGroup.Item>
        <div className="Container__row--space-between">
            <div>{candidate?.userName} - {candidate?.userEmail}</div>
            <Form.Check
              checked={!emailSet.has(candidate?.userEmail)}
              readOnly
            />
        </div>
      </ListGroup.Item>
    );
  }

  const eligibleCandidates = newCandidates.map((candidate, i) => {
    return <CandidateItem candidate={candidate} key={`new ${i}`} />;
  });
  const existingCandidates = dupeCandidates.map((candidate, i) => {
    return <CandidateItem candidate={candidate} key={`old ${i}`} />;
  });

  async function addParticipants(participants) {
    try {
      const response = await createParticipants(participants);
      const newParticipants = response?.data;
      const newList = meeting.participants
        .concat(newParticipants)
        .sort((p1, p2) => p1.userName.localeCompare(p2.userName));
      setMeeting((prev) => ({...prev, participants: newList}));

      if (newParticipants.length === participants.length) {
        toast.success('All new participants have been added!');
      } else {
        toast.warning('Some participants could not be added.');
      }
    } catch (e) {
      toast.error(extractError(e));
    }
  }
  
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header>
        <Modal.Title>Participants Imported</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p className="Text__paragraph">
            The following participants will be added to <b>{meeting.name}</b>.
          </p>
          <Card className="Card__invite">
            <ListGroup variant="flush">
              {eligibleCandidates}
              {existingCandidates}
            </ListGroup>
          </Card>
          <div className="Buffer--10px" />
          <p className="Text__paragraph">Are you sure you want to continue?</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            addParticipants(newCandidates)
            setShow(false);
          }}
          disabled={newCandidates.length === 0}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
