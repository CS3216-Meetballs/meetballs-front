import { Modal, Button, ListGroup, Card } from 'react-bootstrap';

export default function ConfirmInviteModel({
  showModal,
  setShowModal,
  meetingName,
  inviteList,
  sendInvitation,
}) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header>
        <Modal.Title>Send Invitation?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p className="Text__paragraph">
            Invitation to meeting - <b>{meetingName}</b> - will be sent to these
            participants.
          </p>
          <Card
            style={{
              minHeight: '100px',
              maxHeight: '200px',
              margin: '0px 0px 10px 0px',
              padding: '5px',
              overflow: 'hidden',
              overflowY: 'scroll',
            }}
          >
            <ListGroup variant="flush">
              {inviteList.length > 0 ? (
                inviteList.map((ppl, idx) => {
                  return (
                    <ListGroup.Item key={idx}>{ppl.userEmail}</ListGroup.Item>
                  );
                })
              ) : (
                <p
                  className="Text__hint"
                  style={{ textAlign: 'center', height: '100px' }}
                >
                  All participants invited
                </p>
              )}
            </ListGroup>
          </Card>
          <p className="Text__paragraph">Are you sure you want to continue?</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            setShowModal(false);
            sendInvitation(inviteList);
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
