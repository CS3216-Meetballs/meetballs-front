import { Container, Image, Button, Row, Col, Card } from 'react-bootstrap';
import { Facebook, Instagram } from 'react-bootstrap-icons';
import { FaTiktok } from 'react-icons/fa';
import LandingImage from '../../assets/landing_image.png';
import BackgroundImage from '../../assets/background_pattern.jpg';
import PatternImage from '../../assets/pattern.png';
import AgendaImage from '../../assets/guide_agenda_list.jpg';
import MeetingImage from '../../assets/guide_ongoing_meeting.jpg';
import StatisticsImage from '../../assets/guide_report.jpg';
import { Redirect, useHistory } from 'react-router';
import AppFooter from '../../components/AppFooter';
import { useContext, useEffect } from 'react';
import { logEvent } from '@firebase/analytics';
import { googleAnalytics } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';

export default function LandingScreen() {
  const history = useHistory();
  const user = useContext(UserContext);

  useEffect(() => {
    logEvent(googleAnalytics, 'visit_landing_page');
  }, []);

  if (user) return <Redirect to="/home" />;

  return (
    <div>
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Row style={{ marginLeft: 0, marginRight: 0 }}>
          <Col
            sm={12}
            md={12}
            lg={6}
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Image src={PatternImage} className="Image__landing-pattern" />
            <div className="Container__center--vertical">
              <div className="Buffer--100px" />
              <div className="Container__padding--horizontal">
                <p className="Text__header">Get the Ball Rolling</p>
                <p className="Text__subheader">
                  Plan, track {'&'} analyse your meetings on Meetballs{' '}
                </p>
                <p>• Keep track of attendance</p>
                <p>• Pace your meetings with intelligent agenda</p>
                <p>• Mass email participants</p>
                <p>• Analyse meeting statistics</p>
                <div className="Buffer--20px" />
                <Button
                  className="social-link-btn"
                  variant="outline-facebook"
                  href="https://www.facebook.com/MeetBallsApp/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook size={23} style={{ marginRight: 10 }} />
                  Find Us On Facebook
                </Button>
                <div className="Buffer--20px" />
                <Button
                  className="social-link-btn"
                  variant="outline-primary"
                  href='https://www.instagram.com/meetballsapp/'
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram size={23} style={{ marginRight: 10 }} />
                  Find Us On Instagram
                </Button>
                <div className="Buffer--20px" />
                <Button
                  className="social-link-btn"
                  variant="outline-tiktok"
                  href='https://www.tiktok.com/@meetballsapp'
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTiktok size={23} style={{ marginRight: 10 }} />
                  Find Us On TikTok
                </Button>
              </div>
            </div>
          </Col>
          <Col
            sm={0}
            md={0}
            lg={6}
            className="d-none d-lg-block"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Image src={LandingImage} fluid />
          </Col>
        </Row>
        <div className="Buffer--100px" />
        <div
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            paddingBottom: 30,
            paddingTop: 30,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Container>
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                paddingLeft: 'auto',
                paddingRight: 'auto',
                textAlign: 'center',
              }}
            >
              <iframe
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  borderRadius: 5,
                  top: 0,
                  left: 0,
                }}
                src={'https://www.youtube.com/embed/c8qQhg3S80s'}
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Container>
        </div>
        <Container>
          <div className="Buffer--50px" />

          <Container>
            <p className="Text__header">Plan Meetings</p>
            <Row>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      1. Create a new meeting or clone an existing one.
                    </Card.Title>
                    <Card.Text>
                      Link a Zoom meeting to MeetBalls. Clone an existing
                      MeetBalls meeting to copy over participants and agenda
                      items to the new meeting.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>2. Add participants to the meeting.</Card.Title>
                    <Card.Text>
                      Fill the participants list to make use of the various
                      features that MeetBalls has, including attendance taking
                      and sending of email invitations.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>3. Plan the agenda for the meeting.</Card.Title>
                    <Card.Text>
                      Add agenda items to the agenda to view them during the
                      meeting. Attach files to agenda items and link
                      participants to agenda items.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      4. Send out invites to all participants.
                    </Card.Title>
                    <Card.Text>
                      Inviting pariticipants to the meeting is just 2 clicks
                      away. Participants will receive personalized email with
                      their very own link to access the meeting.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="Buffer--20px" />
            <Row>
              <p className="Text__header">Track Meetings</p>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>1. Take attendance automatically.</Card.Title>
                    <Card.Text>
                      Thanks to integration with Zoom, MeetBalls is able to
                      automatically update the attendance list when the
                      participant enters the Zoom meeting.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      2. Be alerted when you exceed the time limit.
                    </Card.Title>
                    <Card.Text>
                      Stay on track of your schedule with MeetBalls. When time
                      is up for an item, the bell will go off to alert you to
                      move on to the next item.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      3. Analyse and learn from past meeting.
                    </Card.Title>
                    <Card.Text>
                      View meeting statistics, attendance and duration of each
                      agenda item from past meetings.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      4. Mass email to participants after the meeting.
                    </Card.Title>
                    <Card.Text>
                      Need to send out meeting minutes? Include all participants
                      in your email with just a click of a button from any
                      completed meeting.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="Buffer--20px" />
            <Row>
              <p className="Text__header">Join Meetings</p>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      1. Upload files for your presentations.
                    </Card.Title>
                    <Card.Text>
                      View the items you are presenting during the meeting and
                      attach relevant files or link via the invitation link sent
                      to your email.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      2. Suggests topics for meeting agenda.
                    </Card.Title>
                    <Card.Text>
                      Have something to discuss or present during the meeting?
                      Leave a suggestion and the meeting host will be able to
                      see it.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      3. Access files for each presentation.
                    </Card.Title>
                    <Card.Text>
                      Before or during the meeting, you can gain access to the
                      files the presenter has uploaded from the agenda list.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                sm={12}
                md={6}
                lg={3}
                className="Container__padding--vertical-medium"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      4. Get an estimate of when the meeting will end.
                    </Card.Title>
                    <Card.Text>
                      Your time is precious. MeetBalls provides an estimated end
                      time of the meeting based on the items remaining in the
                      agenda.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>

          <div className="Buffer--50px" />
        </Container>
      </Container>
      <AppFooter />
    </div>
  );
}
