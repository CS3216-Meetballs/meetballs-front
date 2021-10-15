import DatePicker from 'react-datepicker';
import { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Card, Toast } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { defaultHeaders } from '../../utils/axiosConfig';
import * as yup from 'yup';
import { Formik } from 'formik';

import 'react-datepicker/dist/react-datepicker.css';
import server from '../../services/server';
import { getFormattedDateTime } from '../../common/CommonFunctions';
import { FullLoadingIndicator } from '../../components/FullLoadingIndicator';
import { toast } from 'react-toastify';

export default function AddMeetingOverlay({
  show,
  setShow,
  onUpdate,
  checkIfExist,
}) {
  const [loading, setLoading] = useState(false);
  const [showZoomList, setShowZoomList] = useState(false);
  const [zoomMeetingList, setZoomMeetingList] = useState([]);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isZoomMeeting, setIsZoomMeeting] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (show) {
      getZoomMeetingList();
    }
  }, [show]);

  async function getZoomMeetingList() {
    try {
      setLoading(true);
      setShowErrorToast(true);
      const response = await server.get(`/zoom/meetings`, defaultHeaders);
      const result = response.data;
      if (response.status !== 200) return;
      const filteredList = [];
      result.forEach((meeting) => {
        if (!checkIfExist(meeting.uuid)) {
          filteredList.push(meeting);
        }
      });
      setZoomMeetingList(filteredList);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  async function submit({
    name,
    desc,
    date,
    meetingId,
    meetingPassword,
    link,
  }) {
    console.log(server.defaults.headers.common['Authorization']);
    const newMeeting = {
      name: name,
      description: desc,
      startedAt: date.toISOString(),
      duration: 1800000,
      meetingId: `${meetingId}`,
      meetingPassword: meetingPassword,
      joinUrl: link,
      enableTranscription: true,
    };
    const key = isZoomMeeting ? `/zoom/meetings/${meetingId}` : '/meeting';
    setLoading(true);
    return server
      .post(key, newMeeting, defaultHeaders)
      .then((res) => {
        onUpdate();
        const id = res.data.id;
        console.log('New meeting created with ID = ' + id);
        setShow(false);
        history.push('/meeting/' + id);
      })
      .catch(() => {
        setShowErrorToast(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function selectMeeting(id, setFieldValue) {
    try {
      setLoading(true);
      const response = await server.get('/zoom/meetings/' + id, defaultHeaders);
      const meeting = response.data;
      if (response.status !== 200) return;
      setFieldValue('name', meeting.topic);
      setFieldValue('desc', meeting.agenda);
      setFieldValue('meetingId', id);
      setFieldValue('meetingPassword', meeting.password);
      setFieldValue('link', meeting.join_url);
      setFieldValue('date', new Date(meeting.start_time));
      setIsZoomMeeting(true);
      setShowZoomList(false);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  function ManualInput({
    handleSubmit,
    handleChange,
    setFieldValue,
    values,
    touched,
    isValid,
    errors,
  }) {
    return (
      <>
        <Form.Group>
          <Form.Label column>Meeting Name</Form.Label>
          <Form.Control
            required
            placeholder="Please enter meeting name"
            name="name"
            onChange={handleChange}
            value={values.name}
            isValid={touched.name && !errors.name}
          />
          <Form.Label column>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="desc"
            style={{ height: 200 }}
            placeholder="What is the meeting for?"
            onChange={handleChange}
            value={values.desc}
            isValid={touched.desc && !errors.desc}
          />
          <Form.Label column>Meeting ID</Form.Label>
          <Form.Control
            required
            name="meetingId"
            placeholder="Please enter meeting ID"
            onChange={handleChange}
            value={values.meetingId}
            isValid={touched.meetingId && !errors.meetingId}
            disabled={isZoomMeeting}
          />
          <Form.Label column>Meeting Password</Form.Label>
          <Form.Control
            required
            name="meetingPassword"
            placeholder="Please enter meeting password"
            onChange={handleChange}
            value={values.meetingPassword}
            isValid={touched.meetingPassword && !errors.meetingId}
            disabled={isZoomMeeting}
          />
          <Form.Label column>Meeting link</Form.Label>
          <Form.Control
            required
            name="link"
            placeholder="Please enter meeting link"
            onChange={handleChange}
            value={values.link}
            isValid={touched.link && !errors.link}
            disabled={isZoomMeeting}
          />
          <Form.Label column>Start Date</Form.Label>
          <DatePicker
            name="date"
            selected={values.date}
            showTimeSelect
            onChange={(date) => setFieldValue('date', date)}
            dateFormat="Pp"
            customInput={<Form.Control />}
            disabled={isZoomMeeting}
          />
        </Form.Group>
        <div className="Buffer--20px" />
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
            Add new Meeting
          </Button>
        </div>
        <div className="Buffer--20px" />
        <Toast
          show={showErrorToast}
          onClose={() => setShowErrorToast(false)}
          autohide
          delay={2000}
        >
          <Toast.Header closeButton={false}>Error</Toast.Header>
          <Toast.Body>
            Unable to create meeting. Please check if it has already been added.
          </Toast.Body>
        </Toast>
      </>
    );
  }

  function ZoomMeetingList({ setFieldValue }) {
    const items = [];
    zoomMeetingList.forEach((meeting, idx) => {
      const startTime = meeting.start_time;
      const dateStr = startTime
        ? getFormattedDateTime(new Date(startTime))
        : "No date available";
      items.push(
        <div className="Container__padding--vertical-small Clickable" key={idx}>
          <Card
            style={{ cursor: 'pointer' }}
            onClick={() => {
              selectMeeting(meeting.id, setFieldValue);
            }}
          >
            <Card.Body>
              <Card.Title>{meeting.topic}</Card.Title>
              <Card.Text>{dateStr}</Card.Text>
            </Card.Body>
          </Card>
        </div>,
      );
    });
    return items;
  }

  return (
    <Formik
      validationSchema={schema}
      initialValues={initialValue}
      onSubmit={submit}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Offcanvas
          show={show}
          onHide={() => {
            setShow(false);
            setShowZoomList(false);
          }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add New Meeting</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setShowZoomList(!showZoomList)}
              >
                {showZoomList ? 'Cancel' : 'Select from Zoom'}
              </Button>
            </div>
            {loading ? (
              <FullLoadingIndicator />
            ) : (
              <>
                <div className="Buffer--20px" />
                <div className="Line--horizontal" />
                <div className="Buffer--20px" />
                {!loading && showZoomList ? (
                  <ZoomMeetingList setFieldValue={setFieldValue} />
                ) : (
                  <ManualInput
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    touched={touched}
                    isValid={isValid}
                    errors={errors}
                  />
                )}
              </>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </Formik>
  );
}

const schema = yup.object().shape({
  name: yup.string().required(),
  desc: yup.string().required(),
  meetingId: yup.number().required(),
  meetingPassword: yup.string().required(),
  link: yup.string().url('Must be a valid URL!').required(),
  date: yup.date().required(),
});

const initialValue = {
  name: '',
  desc: '',
  meetingId: '',
  meetingPassword: '',
  link: '',
  date: new Date(),
};
