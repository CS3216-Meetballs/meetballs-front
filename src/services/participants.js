import { defaultHeaders } from '../utils/axiosConfig';
import server from './server';

export const deleteParticipants = (meetingId, userEmail) => {
  const body = {
    meetingId,
    participants: [
      {
        userEmail,
      },
    ],
  };
  return server.delete(`participant`, body);
};

export const createParticipant = (meetingId, userEmail, userName) => {
  const body = {
    meetingId,
    userEmail,
    userName,
  };
  return server.post(`participant`, body, defaultHeaders);
};

export const markParticipantPresent = (meetingId, userEmail) => {
  const body = {
    email: userEmail,
  };
  console.log(server.defaults.headers);
  return server.put(`participant/${meetingId}/present`, body);
};

export const markParticipantAbsent = (meetingId, userEmail) => {
  const body = {
    email: userEmail,
  };
  return server.put(`participant/${meetingId}/absent`, body);
};
