import { Button, Row, Col, Card } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import {
  getFormattedDuration,
  openLinkInNewTab,
} from '../../common/CommonFunctions';
import EditAgendaItem from './EditAgendaItem';
import server from '../../services/server';
import { defaultHeaders } from '../../utils/axiosConfig';
import { SmallLoadingIndicator } from '../../components/SmallLoadingIndicator';
import { toast } from 'react-toastify';
import { Link45deg } from 'react-bootstrap-icons';
import {
  MaterialsSection,
  SpeakerSection,
} from '../../components/AgendaItemComponents';
import { extractError } from '../../utils/extractError';

export default function AgendaItem({
  meeting,
  setMeeting,
  position,
  isReordering,
  isDeleting,
  setDeleting,
}) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const item = meeting.agendaItems[position];

  async function removeAgendaItem() {
    if (isDeleting) return;
    try {
      setDeleting(true);
      setLoading(true);
      const newMeeting = Object.assign({}, meeting);
      const newAgenda = newMeeting.agendaItems;
      const actualPosition = newAgenda[position].position;
      newAgenda.splice(position, 1);
      for (let i = 0; i < newAgenda.length; i++) {
        newAgenda[i].position = i;
      }
      newMeeting.agendaItems = newAgenda;
      await removeFromDatabase(meeting.id, actualPosition);
      setMeeting(newMeeting);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
    setDeleting(false);
  }

  if (isReordering && editing) {
    setEditing(false);
  }

  if (editing) {
    // Editing
    return (
      <>
        {loading ? (
          <SmallLoadingIndicator />
        ) : (
          <Draggable
            draggableId={'Draggable' + item.position}
            index={position}
            isDragDisabled={true}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <EditAgendaItem
                  setLoading={setLoading}
                  setEditing={setEditing}
                  meeting={meeting}
                  position={position}
                />
              </div>
            )}
          </Draggable>
        )}
      </>
    );
  }

  // Not editing
  return (
    <>
      {loading ? (
        <SmallLoadingIndicator />
      ) : (
        <Draggable
          draggableId={'Draggable' + item.position}
          index={position}
          isDragDisabled={!isReordering}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Col className="Container__padding--vertical-small">
                <Card>
                  <Card.Header className="Container__row--space-between">
                    {getFormattedDuration(item.expectedDuration)}
                    {item.speakerMaterials ? (
                      <Link45deg
                        size={24}
                        className="Clickable"
                        onClick={() => openLinkInNewTab(item.speakerMaterials)}
                      />
                    ) : null}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Subtitle>
                      {item.speakerName
                        ? 'Presented by ' + item.speakerName
                        : ''}
                    </Card.Subtitle>
                    <div className="Buffer--10px" />
                    <Card.Text>{item.description}</Card.Text>
                    {isReordering || (
                      <Row>
                        <Col>
                          <div className="d-grid gap-2">
                            <Button variant="danger" onClick={removeAgendaItem}>
                              Remove
                            </Button>
                          </div>
                        </Col>
                        <Col>
                          <div className="d-grid gap-2">
                            <Button
                              variant="primary"
                              onClick={() => setEditing(true)}
                            >
                              Edit
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </div>
          )}
        </Draggable>
      )}
    </>
  );
}

async function removeFromDatabase(meetingId, position) {
  await server.delete(`/agenda-item/${meetingId}/${position}`, defaultHeaders);
}
