import { Col, Card } from 'react-bootstrap';
import { getFormattedDuration } from '../../common/CommonFunctions';
import {
  MaterialsSection,
  SpeakerSection,
} from '../../components/AgendaItemComponents';

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
          <SpeakerSection item={item} />
          <div className="Buffer--10px" />
          <Card.Text>{item.description}</Card.Text>
          <MaterialsSection item={item} />
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
  const exceeded = currentDuration - item.expectedDuration;
  var timeRemainingText =
    'Time Remaining: ' +
    getFormattedDuration(timeRemaining - (timeRemaining % 1000));
  if (exceeded > 0) {
    timeRemainingText +=
      ` ( Exceeded by ${getFormattedDuration(exceeded - (exceeded % 60000))})`;
  }
  return (
    <Col className="Container__padding--vertical-small">
      <Card bg={timeRemaining > 0 ? 'primary' : 'danger'} text="light">
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>{item.description}</Card.Text>
          <SpeakerSection item={item} />
          <MaterialsSection item={item} variant={'secondary'} />
        </Card.Body>
        <Card.Footer>
          <Card.Text>{timeRemainingText}</Card.Text>
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
          <SpeakerSection item={item} />
          <MaterialsSection item={item} variant={'outline-primary'} />
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
