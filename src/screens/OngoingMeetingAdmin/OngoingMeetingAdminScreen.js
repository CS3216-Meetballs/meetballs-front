import { Container, Row, Col, Button, Nav, Toast } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { useState, useEffect, useContext, useMemo } from 'react';
import {
  getFormattedDateTime,
  getFormattedTime,
  agendaReviver,
} from '../../common/CommonFunctions';
import AgendaList from './AgendaList';
import { blankMeeting } from '../../common/ObjectTemplates';
import ParticipantList from './ParticipantList';
import {
  getMeeting,
  callStartMeeting,
  callEndMeeting,
  callNextMeeting,
} from '../../services/meeting';
import { useSocket } from '../../hooks/useSocket';
import { UserContext } from '../../context/UserContext';

export default function OngoingMeetingAdminScreen() {
  const [position, setPosition] = useState(-1);
  const [meeting, setMeeting] = useState(blankMeeting);
  const [currentTab, setCurrentTab] = useState('agenda');
  const [time, setTime] = useState(new Date().getTime());
  const { socket } = useSocket(meeting.id);
  const user = useContext(UserContext);
  const { id } = useParams();
  const isHost = useMemo(() => {
    console.log(user);
    return meeting?.hostId === user?.uuid;
  }, [meeting.hostId, user]);
  const history = useHistory();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    console.log(meeting);
  }, [meeting]);

  useEffect(() => {
    pullMeeting();
    setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('meetingUpdated', function (data) {
        console.log('meetingUpdated', data);
        const newMeeting = JSON.parse(data, agendaReviver);
        setMeeting((meeting) => updateMeeting({ ...meeting, ...newMeeting }));
      });
      socket.on('participantUpdated', function (data) {
        console.log('participantUpdated', data);
        const update = JSON.parse(data);
        setMeeting((meeting) => ({
          ...meeting,
          participants: updateParticipants(meeting.participants, update),
        }));
      });
      socket.on('agendaUpdated', function (data) {
        console.log('agendaUpdated', data);
        pullMeeting();
      });
      socket.on('userConnected', function (msg) {
        console.log(msg);
      });
    } else {
      socket && socket.removeAllListeners();
    }
  }, [socket]);

  function startZoom() {
    window.open(meeting.joinUrl, '_blank');
  }

  const updateMeeting = (meetingObj) => {
    meetingObj.participants.sort((p1, p2) => {
      return (' ' + p1.userName).localeCompare(p2.userName);
    });
    meetingObj.agendaItems.sort((p1, p2) => {
      return p1.position - p2.position;
    });
    setShowError(meetingObj.agendaItems.length === 0);
    console.log(meetingObj);
    syncMeeting(meetingObj, time);
    return meetingObj;
  };

  async function pullMeeting() {
    try {
      const res = await getMeeting(id);
      setMeeting(() => updateMeeting(res.data));
    } catch (err) {
      history.replace('/');
    }
  }

  async function startMeeting(time, agenda, id) {
    if (agenda.length < 1) {
      return;
    }
    try {
      await callStartMeeting(id);
      setPosition(position + 1);
      initializeAgenda(time, agenda);
    } catch (err) {
      console.log(err);
    }
  }

  async function nextItem(time, agenda, id) {
    const apiCall =
      position + 1 < agenda.length ? callNextMeeting : callEndMeeting;
    try {
      await apiCall(id);
      agenda[position].actualDuration = time - agenda[position].startTime;
      const newPosition = position + 1;
      setPosition(newPosition);
      if (newPosition < agenda.length) {
        agenda[newPosition].startTime = time;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function syncMeeting(meeting) {
    if (meeting.type === 1) {
      // waiting to start
      return;
    } else if (meeting.type === 2) {
      // started
      const pos = getCurrentPosition(meeting);
      setPosition(pos);
      const agenda = meeting.agendaItems;
      var lastTiming = agenda[pos].startTime;
      for (let i = pos; i < agenda.length; i++) {
        agenda[i].startTime = lastTiming;
        agenda[i].actualDuration = agenda[i].expectedDuration;
        lastTiming += agenda[i].actualDuration;
      }
      return;
    } else if (meeting.type === 3) {
      // meeting ended
      setPosition(meeting.agendaItems.length);
      return;
    }
  }

  updateDelay(meeting.agendaItems, time, position);

  return (
    <>
      <Container className="Container__padding--vertical">
        <Row>
          <Col
            lg={4}
            md={12}
            sm={12}
            className="Container__padding--horizontal"
          >
            <p className="Text__header">{meeting.name}</p>
            <p className="Text__subheader">
              {getFormattedDateTime(meeting.startedAt)}
            </p>
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                onClick={startZoom}
                enabled={meeting.type === 1 || meeting.type === 2}
              >
                Relaunch Zoom
              </Button>
            </div>
            <div className="Buffer--20px" />
            <div className="Line--horizontal" />
            <div className="Buffer--20px" />
            <p>
              {position < meeting.agendaItems.length
                ? 'Estimated End Time:'
                : 'Time Ended:'}
            </p>
            <p className="Text__header">
              {getEndTime(time, meeting.agendaItems, position)}
            </p>
            <div className="d-grid gap-2">
              {isHost && !showError ? (
                <AgendaToggle
                  position={position}
                  agenda={meeting.agendaItems}
                  time={time}
                  id={meeting.id}
                  isHost={isHost}
                  startMeeting={startMeeting}
                  nextItem={nextItem}
                />
              ) : (
                <MeetingStatus
                  position={position}
                  agenda={meeting.agendaItems}
                />
              )}
            </div>
            <div className="Buffer--20px" />
            <Toast show={showError}>
              <Toast.Header closeButton={false}>No Agenda Found</Toast.Header>
              <Toast.Body>
                Please add an agenda item to the meeting first before starting.
              </Toast.Body>
              <Toast.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      history.push('/meeting/' + id);
                    }}
                  >
                    Back to Editing
                  </Button>
                </div>
              </Toast.Body>
            </Toast>
            <div className="Buffer--20px" />
          </Col>
          <Col lg={1} md={12} sm={12} />
          <Col
            lg={6}
            md={12}
            sm={12}
            className="Container__padding--horizontal"
          >
            <Nav
              variant="tabs"
              defaultActiveKey="agenda"
              onSelect={(selectedKey) => setCurrentTab(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="agenda">Agenda</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="participants">Participants</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="Buffer--20px" />
            {currentTab === 'agenda' ? (
              <AgendaList
                time={time}
                agenda={meeting.agendaItems}
                position={position}
              />
            ) : (
              <ParticipantList
                meeting={meeting}
                setMeeting={setMeeting}
                position={position}
                shouldShowButton={isHost}
              />
            )}
            <div className="Buffer--100px" />
          </Col>
        </Row>
      </Container>
    </>
  );
}

// Agenda

function AgendaToggle({ position, time, agenda, id, startMeeting, nextItem }) {
  if (position < 0) {
    return (
      <Button onClick={() => startMeeting(time, agenda, id)}>
        Start Meeting
      </Button>
    );
  } else if (position < agenda.length) {
    const isLastItem = position === agenda.length - 1;
    const message = isLastItem ? 'Finish Meeting' : 'Next Item';
    return (
      <Button onClick={() => nextItem(time, agenda, id)}>{message}</Button>
    );
  } else {
    return (
      <Button href={`/completed/${id}`}>Meeting Ended - View Report</Button>
    );
  }
}

function MeetingStatus({ position, agenda }) {
  if (position < 0) {
    return <p className="Text__subheader">Meeting Not Started</p>;
  } else if (position < agenda.length) {
    return <p className="Text__subheader">Meeting Ongoing</p>;
  } else {
    return <p className="Text__subheader">Meeting Ended</p>;
  }
}

function initializeAgenda(time, agenda) {
  var lastTiming = time;
  for (let i = 0; i < agenda.length; i++) {
    agenda[i].actualDuration = agenda[i].expectedDuration;
    agenda[i].startTime = lastTiming;
    lastTiming += agenda[i].actualDuration;
  }
}

function updateDelay(agenda, time, position) {
  if (position < 0 || position >= agenda.length) return;
  const delay = Math.max(
    0,
    time - agenda[position].startTime - agenda[position].actualDuration,
  );
  agenda[position].actualDuration += delay;
  updateAgenda(agenda, position);
}

function updateAgenda(agenda, position) {
  for (let i = 0; i < agenda.length; i++) {
    agenda[i].isCurrent = i === position;
  }
  if (position >= agenda.length) return;
  var lastTiming = agenda[position].startTime;
  for (let i = position; i < agenda.length; i++) {
    agenda[i].startTime = lastTiming;
    lastTiming += agenda[i].actualDuration;
  }
}

function getCurrentPosition(meeting) {
  const agenda = meeting.agendaItems;
  for (let i = 0; i < agenda.length; i++) {
    if (agenda[i].isCurrent) {
      return i;
    }
  }
}

function getEndTime(time, agenda, position) {
  if (position < 0) {
    var duration = 0;
    agenda.forEach((item) => {
      duration += item.expectedDuration;
    });
    return getFormattedTime(new Date(time + duration));
  } else {
    if (agenda.length === 0) return '';
    var lastAgendaItem = agenda[agenda.length - 1];
    return getFormattedTime(
      new Date(lastAgendaItem.startTime + lastAgendaItem.actualDuration),
    );
  }
}

function updateParticipants(participants, update) {
  let hasUpdate = false;
  participants = participants.map((ppl) => {
    if (ppl.userEmail === update.userEmail) {
      hasUpdate = true;
      return update;
    } else {
      return ppl;
    }
  });

  if (!hasUpdate) {
    return [update, ...participants].sort((p1, p2) => {
      return (' ' + p1.userName).localeCompare(p2.userName);
    });
  } else {
    return participants;
  }
}
