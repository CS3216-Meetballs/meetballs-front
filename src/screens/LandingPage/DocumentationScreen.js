import { Image, Row, Col } from 'react-bootstrap';
import Banner from '../../assets/banner_privacy.jpg';
import AddAgendaImage from '../../assets/guide_add_agenda.png';
import AgendaListImage from '../../assets/guide_agenda_list.png';
import DashboardImage from '../../assets/guide_dashboard.png';
import OngoingMeetingImage from '../../assets/guide_ongoing_meeting.png';
import MeetingReportImage from '../../assets/guide_report.png';
import SampleEmailImage from '../../assets/guide_sample_email.png';

export default function DocumentationScreen() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Image
          src={Banner}
          style={{
            height: 300,
            width: '100%',
            objectFit: 'cover',
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
          <p
            className="Text__header"
            style={{ color: 'white', textAlign: 'center' }}
          >
            Zoom Integration Documentation
          </p>
        </div>
      </div>
      <Row className="Container__padding--vertical Container__padding--horizontal">
        <Col sm={12} md={12} lg={{ span: 6, offset: 3 }}>
          <p className="Text__subsubheader">Last updated: October 15, 2021</p>

          <p className="Text__paragraph">
            MeetBalls is an all-in-one companion web app for managing meetings
            and improving productivity. It provides a seamless workflow for
            managing all sorts of meeting-related admin tasks from before,
            during and after the meeting all from a single platform.
          </p>
          <p className="Text__paragraph">
            This document provides a simple guide to using MeetBalls with Zoom
          </p>
          <p className="Text__header">‍Installation</p>
          <p className="Text__paragraph">
            MeetBalls uses Zoom OAuth as the main authentication service. This
            means that installation of Zoom is tied in with the login flow.
            MeetBalls can be installed by simply logging in with your Zoom
            account.
          </p>
          <ol className="Text__list">
            <li>
              Login to MeetBalls application using the app's{' '}
              <a
                href="https://meetballsapp.com/login"
                style={{ textDecoration: 'none' }}
              >
                login page
              </a>
            </li>
            <li>Approve Zoom's OAuth application with read-only scopes</li>
            <li>Redirect back to MeetBalls Meeting Dashboard.</li>
            <li>Proceed to exploring the app.</li>
          </ol>

          <p className="Text__header">Usage</p>
          <p className="Text__subheader">Creating a meeting</p>
          <Image
            src={DashboardImage}
            fluid
            alt={'Screen of MeetBalls Meeting Dashboard'}
          />
          <ol className="Text__list">
            <li>Navigate to your Meeting Dashboard</li>
            <li>
              Click the <b>Add Meeeting Floating Action Button</b> at the bottom
              right of your screen
            </li>
            <li>
              Fill in your meeting details manually or link a scheduled zoom
              meeting to MeetBalls
              <ul>
                <li>
                  If you have not created a Zoom meeting beforehand, you can
                  create one from{' '}
                  <a
                    href="https://zoom.us/schedule"
                    style={{ textDecoration: 'none' }}
                  >
                    Zoom website
                  </a>
                </li>
              </ul>
            </li>
            <li>Edit Meeting name and description as necessary</li>
            <li>
              Click on <b>Add new Meeting</b> to confirm the creation
            </li>
          </ol>
          <p className="Text__subheader" style={{ paddingTop: '20px' }}>
            Editing a meeting
          </p>
          <Image
            src={AgendaListImage}
            fluid
            style={{ padding: '10px 0px' }}
            alt={'View of Meeting Edit Screen'}
          />
          <ol className="Text__list">
            <li>
              If you came from the previous step, you should be automatically
              redirected to the edit page
              <ul>
                <li>
                  Otherwise, you can visit the edit page by clicking <b>edit</b>{' '}
                  on the Meeting Dashboard
                </li>
              </ul>
            </li>
            <li>
              Adding participants
              <ol>
                <li>
                  Change to the <b>Participants</b> tab
                </li>
                <li>
                  Add participants by clicking the <b>Floating Action Button</b>{' '}
                  at the bottom right of the screen
                </li>
                <li>Add participant name and email</li>
                <li>
                  Click the <b>Confirm</b> button to submit your changes
                </li>
                <li>
                  To <b>edit</b> or <b>delete</b> the participant, click their
                  corresponding buttons
                </li>
              </ol>
            </li>
            <li>
              Adding agenda items
              <ol>
                <li>
                  Change to the <b>Agenda</b> tab
                </li>
                <li>
                  Add agenda items by clicking the <b>Floating Action Button</b>{' '}
                  at the bottom right of the screen
                </li>
                <Image
                  src={AddAgendaImage}
                  fluid
                  style={{ padding: '10px 0px' }}
                  alt={'Adding agenda view'}
                />
                <li>
                  Edit the agenda items by modifying the <b>name</b>,{' '}
                  <b>duration</b> and <b>descrition</b> of the item.
                </li>
                <li>
                  Click the <b>Confirm</b> button to submit your changes
                </li>
                <li>
                  To <b>edit</b> or <b>delete</b> the item, click their
                  corresponding buttons
                </li>
              </ol>
            </li>
            <li>
              Reordering agenda items
              <ol>
                <li>
                  Change to the <b>Agenda</b> tab
                </li>
                <li>
                  Click the <b>Enable Reordering</b> to enter reordering mode
                </li>
                <li>
                  Reorder your meeting agenda items using <b>drag-and-drop</b>{' '}
                  controls
                </li>
                <li>
                  After you are done, click the <b>Save Order</b> button to
                  submit your changes
                </li>
              </ol>
            </li>
            <li>
              Updating/ Deleting Meeting information
              <ol>
                <li>
                  On the edit meeting page, click on the{' '}
                  <b>Edit/Delete Meeting</b> button
                </li>
                <li>
                  To edit the meeting name and description, modify the field and
                  click <b>Update</b>
                </li>
                <li>
                  To delete the meeting, click the <b>Delete Meeting</b> button.{' '}
                  <i>*This operation is irreversible*</i>
                </li>
              </ol>
            </li>
            <li>
              Sending invites
              <ul>
                <li>
                  After you are done with your meeting setup, click on the{' '}
                  <b>Email Participants</b> buton to send invitation emails to
                  all participants
                </li>
                <li>
                  Review the participant list one more time and click{' '}
                  <b>Confirm</b> to send the invitation
                  <ol>
                    <li>
                      This will send a unique MeetBalls join link to all the
                      (uninvited) meeting participants
                    </li>
                    <li>
                      This is a sample email that a participant may receive
                    </li>
                    <Image
                      src={SampleEmailImage}
                      fluid
                      style={{ padding: '10px 0px' }}
                      alt={'Sample email invitation'}
                    />
                  </ol>
                </li>
              </ul>
            </li>
          </ol>
          <p className="Text__subheader" style={{ paddingTop: '20px' }}>
            Starting a meeting
          </p>
          <ul className="Text__list">
            <li>
              To start a meeting click the <b>Start Meeting</b> button on the
              Edit Meeting page or the <b>Video icon</b> on the Meeting
              Dashboard
            </li>
            <li>This will open up a Zoom join link</li>
            <li>
              You will be auto redirected to the ongoing meeting screen where
              you can manage your meeting flow
            </li>
            <Image
              src={OngoingMeetingImage}
              fluid
              style={{ padding: '10px 0px' }}
              alt={'Ongoing meeting view'}
            />
            <li>
              You can move the agenda item by clicking on the <b>Next Item</b>{' '}
              or <b>Start Meeting</b> button
            </li>
            <li>
              Your allocated time for each agenda item and the current agenda
              item will be shown on the agenda list
            </li>
            <li>
              Attendance marking is automated by tracking Zoom participants. You
              can choose to manually mark participant's attendance from the{' '}
              <b>Participants</b> tab
            </li>
            <li>
              Invited participants are able to see the live Zoom meeting status
              by joining using the custom MeetBall link. i.e. They are able to
              see the current agenda item, agenda list, participant list and
              estimated end time
            </li>
          </ul>
          <p className="Text__subheader" style={{ paddingTop: '20px' }}>
            Ending a meeting
          </p>
          <ul>
            <li>
              A meeting automatically ends once all the agenda items are
              completed.
            </li>
            <li>
              The Meetball meeting flow runs independently from the actual Zoom
              Meeting. You can choose to end the MeetBall meeting and continue
              to use the Zoom Meeting for other communication needs. The usage
              is up to the discretion of the end-user.
            </li>
          </ul>

          <p className="Text__subheader" style={{ paddingTop: '20px' }}>
            Viewing meeting report
          </p>
          <Image
            src={MeetingReportImage}
            fluid
            style={{ padding: '10px 0px' }}
            alt={'Meeting report view'}
          />
          <ul className="Text__list">
            <li>
              After the meeting has ended, you can view the report by clicking
              the <b>View Report</b> button in the same meeting view or by
              clicking the button from the Meeting Dashboard
            </li>
            <li>
              In the <b>Statistics</b> tab, you can see your meeting duration,
              attendance rate and comparison of actual and expected meeting
              duration.
            </li>
            <li>
              In the <b>Participants</b> tab, you can see the list of presentees
              and absentees. You can export the data by clicking the{' '}
              <b>Export to CSV</b> button
            </li>
            <li>
              In the <b>Agenda</b> tab, you can see the overview of your agenda
              items and the time taken for each agenda
            </li>
            <li>
              From here, you can click on <b>Email Participants</b> to send an
              email to all participants using your email client. (This will
              launch your email client) This is useful for sending meeting
              minutes or after-meeting report to the attendees.
            </li>
          </ul>

          <p className="Text__header">Uninstallation</p>
          <ol className="Text__list">
            <li>
              Login to your Zoom Account and navigate to the Zoom App
              Marketplace.
            </li>
            <li>
              Click <b>Manage > Installed Apps</b> or search for the{' '}
              <b>MeetBalls</b> app.
            </li>
            <li>
              Click the <b>MeetBalls</b> app.
            </li>
            <li>
              Click <b>Uninstall</b>.
            </li>
          </ol>
        </Col>
      </Row>
    </>
  );
}
