import {
	Button,
	Row,
	Col,
	Card,
	DropdownButton,
	Dropdown,
	Form,
	CloseButton,
} from "react-bootstrap";
import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { getFormattedDuration } from "../../common/CommonFunctions";

export default function AgendaItem({ meeting, setMeeting, position }) {
	const [editing, setEditing] = useState(false);
	const item = meeting.agendaItems[position];
	const [duration, setDuration] = useState(item.expectedDuration);

	function DurationItems() {
		const items = [];
		durationMinutes.forEach((duration) =>
			items.push(
				<Dropdown.Item
					onClick={() => {
						item.expectedDuration = duration.mils;
						setDuration(duration.mils);
					}}
				>
					{duration.display}
				</Dropdown.Item>
			)
		);
		return items;
	}

	if (editing) {
		// Editing
		return (
			<Draggable
				draggableId={"Draggable" + item.position}
				index={position}
			>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
						<Col className="Container__padding--vertical-small">
							<Card bg="light">
								<Card.Header>
									<div className="Container__row--space-between">
										<p className="Text__card-header">
											Editing Agenda Item
										</p>
										<CloseButton
											onClick={() => setEditing(false)}
										/>
									</div>
								</Card.Header>
								<Card.Body>
									<Form.Group>
										<Form.Label column>Name</Form.Label>
										<Form.Control
											defaultValue={item.name}
											onChange={(event) =>
												(item.name = event.target.value)
											}
										/>
										<Form.Label column>Duration</Form.Label>
										<DropdownButton
											variant="outline-secondary"
											title={getFormattedDuration(
												duration
											)}
										>
											{DurationItems()}
										</DropdownButton>
										<Form.Label column>
											Description
										</Form.Label>
										<Form.Control
											as="textarea"
											defaultValue={item.description}
											onChange={(event) =>
												(item.description =
													event.target.value)
											}
										/>
									</Form.Group>
								</Card.Body>
							</Card>
						</Col>
					</div>
				)}
			</Draggable>
		);
	}

	// Not editing
	return (
		<Draggable draggableId={"Draggable" + item.position} index={position}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<Col className="Container__padding--vertical-small">
						<Card bg="light">
							<Card.Header>
								{getFormattedDuration(item.expectedDuration)}
							</Card.Header>
							<Card.Body>
								<Card.Title>{item.name}</Card.Title>
								<Card.Text>{item.description}</Card.Text>
								<Row>
									<Col>
										<div className="d-grid gap-2">
											<Button
												variant="outline-danger"
												onClick={() =>
													removeAgendaItem(
														setMeeting,
														meeting,
														position
													)
												}
											>
												Remove
											</Button>
										</div>
									</Col>
									<Col>
										<div className="d-grid gap-2">
											<Button
												variant="outline-secondary"
												onClick={() => setEditing(true)}
											>
												Edit
											</Button>
										</div>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</div>
			)}
		</Draggable>
	);
}

function removeAgendaItem(setMeeting, meeting, position) {
	const newMeeting = Object.assign({}, meeting);
	const newAgenda = newMeeting.agendaItems;
	newAgenda.splice(position, 1);
	for (let i = 0; i < newAgenda.length; i++) {
		newAgenda[i].position = i;
	}
	newMeeting.agendaItems = newAgenda;
	setMeeting(newMeeting);
}

const durationMinutes = [
	{ mils: 300000, display: "5min" },
	{ mils: 600000, display: "10min" },
	{ mils: 900000, display: "15min" },
	{ mils: 1200000, display: "20min" },
	{ mils: 1500000, display: "25min" },
	{ mils: 1800000, display: "30min" },
	{ mils: 2100000, display: "35min" },
	{ mils: 2400000, display: "40min" },
	{ mils: 2700000, display: "45min" },
	{ mils: 3000000, display: "50min" },
	{ mils: 3300000, display: "55min" },
	{ mils: 3600000, display: "1h 0min" },
];
