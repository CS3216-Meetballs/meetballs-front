import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner, Container, Col, Form, Toast, Button } from "react-bootstrap";
import { useParams } from "react-router";

function ResendConfirmationForm() {

    const [ email, setEmail ] = useState("");
    function readyToSubmit() {
        return email.trim().length > 0;
    }

    const [ resent, setResent ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    async function submit() {
        return axios.post('/auth/resend-confirm', {
            email: email
        }).then((response) => {
            if (response.data.success) setSuccess(true);
        }).catch((error) => {
            console.error(error);
            setSuccess(false);
        }).finally(() => setResent(true));
    }

    return (
        <div>
            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formResend">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        autoFocus
                        value={email}
                        onChange={setEmail}
                        placeholder="Enter email here"
                    />
                    <Button
                        block size="lg"
                        disabled={!readyToSubmit()}
                        type="submit"
                    >
                        Resend confirmation email
                    </Button>
                </Form.Group>
            </Form>
            <Toast show={resent && success}>
                <Toast.Header>
                    <strong className="me-auto">Success!</strong>
                </Toast.Header>
                <Toast.Body>Confirmation email has been resent to your inbox</Toast.Body>
            </Toast>
            <Toast show={resent && !success}>
                <Toast.Header>
                    <strong className="me-auto">Error!</strong>
                </Toast.Header>
                <Toast.Body>Email not found, are you sure you have registered?</Toast.Body>
            </Toast>
        </div>
    );
}

export default function EmailConfirmationScreen() {
    const { token } = useParams();

    const [ responseMsg, setResponseMsg ] = useState('');
    const [ isLoading, setLoading ] = useState(true);

    useEffect(() => {
        console.log(`Begin email confirmation! Token is ${token}`);
        return axios.post('/auth/confirm', {
            token: token
        })
        .then(res => {
            console.log('Email confirmation');
            setResponseMsg(res.data.message);
        })
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
    }, []);

    if (isLoading) {
        return (
            <>
                <Container className="Container__padding--vertical">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container className="Container__padding--vertical">
                <Col
                    lg={3}
                    md={12}
                    sm={12}
                    className="Container__padding--horizontal"
                >
                    <p>
                        { responseMsg === '' ? "Email confirmation failed" : responseMsg }
                    </p>
                    <ResendConfirmationForm />
                </Col>
            </Container>
        </>
    );
}
