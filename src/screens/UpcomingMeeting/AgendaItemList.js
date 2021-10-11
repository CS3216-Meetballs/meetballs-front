import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AgendaItem from './AgendaItem';
import { Button } from 'react-bootstrap';
import { accessTokenKey, apiUrl } from '../../common/CommonValues';

export default function AgendaItemList({
  meeting,
  setMeeting,
  isReordering,
  setReordering,
}) {
  const items = [];
  if (!isReordering) {
    items.push(
      <div
        className="d-grid gap-2"
        onClick={() => {
          setReordering(true);
        }}
        key={'Button'}
      >
        <Button variant="outline-primary">Enable Reordering</Button>
      </div>,
    );
  } else {
    items.push(
      <div
        className="d-grid gap-2"
        onClick={() => {
          setReordering(false);
          updateDatabase(meeting.id, meeting.agendaItems);
        }}
        key={'Button'}
      >
        <Button variant="outline-danger">Save Order</Button>
      </div>,
    );
  }

  items.push(<div className="Buffer--20px" key={'Buffer'} />);
  for (let i = 0; i < meeting.agendaItems.length; i++) {
    items.push(
      <AgendaItem
        key={'Item' + i}
        meeting={meeting}
        setMeeting={setMeeting}
        position={i}
        isReordering={isReordering}
      />,
    );
  }
  return (
    <DragDropContext
      onDragEnd={(result) =>
        onDragEnd(result, meeting, setMeeting, isReordering)
      }
    >
      <Droppable droppableId="Agenda">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function onDragEnd(result, meeting, setMeeting) {
  const { destination, source } = result;
  if (destination === null) return;
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return;
  const newMeeting = Object.assign({}, meeting);
  const newAgenda = newMeeting.agendaItems;
  const item = newAgenda.splice(source.index, 1);
  newAgenda.splice(destination.index, 0, item[0]);
  for (let i = 0; i < newAgenda.length; i++) {
    newAgenda[i].position = i;
  }
  newMeeting.agendaItems = newAgenda;
  setMeeting(newMeeting);
}

async function updateDatabase(meetingId, agendaItems) {
  const changes = [];
  agendaItems.forEach((item) => {
    changes.push({
      oldPosition: item.prevPosition,
      newPosition: item.position,
    });
    item.prevPosition = item.position;
  });
  const url = apiUrl + '/agenda-item/positions';
  const accessToken = window.sessionStorage.getItem(accessTokenKey);
  await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      positions: changes,
      meetingId: meetingId,
    }),
  });
}
