import { useEffect, useState } from 'react';
import { Container, Row, Image } from 'react-bootstrap';
import { CalendarPlusFill } from 'react-bootstrap-icons';
import UpcomingMeetingItem from './UpcomingMeetingItem';
import { defaultHeaders } from '../../utils/axiosConfig';
import AddMeetingOverlay from './AddMeetingOverlay';
import server from '../../services/server';
import { FullLoadingIndicator } from '../../components/FullLoadingIndicator';
import CompletedMeetingItem from './CompletedMeetingItem';
import { getZoomMeeting, getZoomMeetingList } from '../../services/zoom';

export default function DashboardScreen() {
  const [upcoming, setUpcoming] = useState([]);
  const [meetingHistory, setHistory] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingPast, setLoadingPast] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    getBanner();
    // TODO: see here
    getZoomMeetingList()
      .then((res) => res.data)
      .then((meetings) => {
        console.log(meetings);

        if (meetings.length > 0) {
          // technically dont have to call this to get detailed zoom meeting info

          return getZoomMeeting(meetings[0].id).then((res) => {
            console.log(res.data);
            return res.data;
          });
          // return linkZoomMeeting(meetings[0].id, {
          //   enableTranscriptions: false,
          // }).then((res) => {
          //   console.log(res.data);
          //   return res.data;
          // });
        }
      });
    return pullMeetings();
  }, []);

  function pullMeetings() {
    pullPastMeetings();
    pullUpcomingMeetings();
  }

  function pullUpcomingMeetings() {
    function sortMeetings(meetingA, meetingB) {
      const startA = meetingA.startedAt;
      const startB = meetingB.startedAt;
      if (startA > startB) return 1;
      else if (startA < startB) return -1;
      else return 0;
    }

    return server
      .get('/meeting', {
        params: { type: 'upcoming' },
        ...defaultHeaders,
      })
      .then((res) => {
        console.log(res);
        const meetings = res.data;
        const upcoming = meetings.sort(sortMeetings);
        setUpcoming(upcoming);
      })
      .catch(console.error)
      .finally(() => setLoadingUpcoming(false));
  }

  function pullPastMeetings() {
    function sortMeetings(meetingA, meetingB) {
      const startA = meetingA.startedAt;
      const startB = meetingB.startedAt;
      if (startA < startB) return 1;
      else if (startA > startB) return -1;
      else return 0;
    }

    console.log('Retrieving past meetings');
    return server
      .get('/meeting', {
        params: { type: 'past' },
        ...defaultHeaders,
      })
      .then((res) => {
        console.log(res);
        const pastMeetings = res.data.sort(sortMeetings);
        setHistory(pastMeetings);
      })
      .catch(console.error)
      .finally(() => setLoadingPast(false));
  }

  function checkIfExist(id) {
    for (let i = 0; i < upcoming.length; i++) {
      if (upcoming[i].zoomUuid === id.toString()) {
        return true;
      }
    }
    for (let i = 0; i < meetingHistory.length; i++) {
      if (meetingHistory[i].zoomUuid === id.toString()) {
        return true;
      }
    }
    return false;
  }

  const upcomingList = upcoming.map((meeting, idx) => (
    <UpcomingMeetingItem
      key={idx}
      meeting={meeting}
      pullMeeting={pullMeetings}
    />
  ));

  const historyList = meetingHistory.map((meeting, idx) => (
    <CompletedMeetingItem key={idx} meeting={meeting} />
  ));

  if (loadingUpcoming || loadingPast) {
    return <FullLoadingIndicator />;
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Image
          src={getBanner().default}
          fluid
          style={{
            maxHeight: 300,
            width: '100%',
            objectFit: 'cover',
            filter: 'brightness(70%)',
          }}
        />
        <div
          className="Container__center--vertical"
          style={{
            width: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            alignItems: 'center',
          }}
        >
          <p className="Text__header" style={{ color: 'white' }}>
            Welcome Back!
          </p>
          <p style={{ color: 'white', fontWeight: 400, fontSize: 20 }}>
            You have {upcoming.length} upcoming meeting
            {upcoming.length > 1 ? 's' : null}.
          </p>
        </div>
      </div>

      <Container className="Container__padding--vertical">
        <Row>
          {upcomingList}
          {historyList}
        </Row>
      </Container>
      <AddMeetingOverlay
        show={showOverlay}
        setShow={setShowOverlay}
        onUpdate={pullMeetings}
        checkIfExist={checkIfExist}
      />
      <div className="Fab" onClick={() => setShowOverlay(true)}>
        <CalendarPlusFill size={22} color="white" />
      </div>
    </>
  );
}

function getBanner() {
  const time = new Date().getHours();
  if (time < 6) {
    return require('../../assets/banner_night.jpg');
  } else if (time < 10) {
    return require('../../assets/banner_morning.jpg');
  } else if (time < 16) {
    return require('../../assets/banner_afternoon.jpg');
  } else if (time < 20) {
    return require('../../assets/banner_evening.jpg');
  } else {
    return require('../../assets/banner_night.jpg');
  }
}
