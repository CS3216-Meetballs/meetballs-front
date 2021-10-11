import server from './server';
import { agendaReviver } from '../common/CommonFunctions';

// id of meeting
export const getMeeting = async (meetingId) => {
  const res = await server.get(`meeting/${meetingId}`, {
    transformResponse: [],
  });
  res.data = JSON.parse(res.data, agendaReviver);
  return res;
};

export const updateMeeting = (newMeeting) => {
  const { name, description, duration, enableTranscription } = newMeeting;
  const body = {
    ...(name && { name }),
    ...(description && { description }),
    ...(duration && { duration }),
    ...(enableTranscription && { enableTranscription }),
  };
  return server.put(`meeting/${newMeeting.id}`, body);
};

export const callStartMeeting = (id) => {
  return server.post(`meeting/start/${id}`);
};

export const callNextMeeting = (id) => {
  return server.post(`meeting/next/${id}`);
};

export const callEndMeeting = (id) => {
  return server.post(`meeting/end/${id}`);
};
