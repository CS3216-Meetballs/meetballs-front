import { Col, Card } from 'react-bootstrap';
import { getFormattedDuration } from '../../common/CommonFunctions';

export default function AgendaList({ time, agenda, position }) {
  const items = [];
  if (position >= agenda.length) {
    for (let i = 0; i < agenda.length; i++) {
      items.push(<ActiveItem item={agenda[i]} key={'Item ' + i} />);
    }
  } else {
    for (let i = Math.max(0, position); i < agenda.length; i++) {
      if (agenda[i].startTime === null) {
        items.push(<NotStartedItem item={agenda[i]} key={'Item ' + i} />);
      } else if (i === position) {
        items.push(
          <CurrentItem item={agenda[i]} time={time} key="Item Current" />,
        );
      } else {
        items.push(<ActiveItem item={agenda[i]} key={'Item ' + i} />);
      }
    }
  }
  return items;
}

function NotStartedItem({ item }) {
  return (
    <Col className="Container__padding--vertical-small">
      <Card>
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>{item.description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Card.Text>
            Estimated Duration: {getFormattedDuration(item.expectedDuration)}
          </Card.Text>
        </Card.Footer>
      </Card>
    </Col>
  );
}

function CurrentItem({ item, time }) {
  const currentDuration = time - item.startTime;
  const timeRemaining = item.actualDuration - currentDuration;
  return (
    <Col className="Container__padding--vertical-small">
      <Card bg={timeRemaining > 0 ? 'primary' : 'danger'} text="light">
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>{item.description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Card.Text>
            Time Remaining:{' '}
            {getFormattedDuration(timeRemaining - (timeRemaining % 1000))}
          </Card.Text>
        </Card.Footer>
      </Card>
    </Col>
  );
}

function ActiveItem({ item }) {
  return (
    <Col className="Container__padding--vertical-small">
      <Card>
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>{item.description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Card.Text>
            Duration: {getFormattedDuration(item.actualDuration)}
          </Card.Text>
        </Card.Footer>
      </Card>
    </Col>
  );
}
