/* eslint-disable react/prop-types */
import { useState } from "react";
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../api";
import { useNavigate } from "react-router-dom";

function Register({ setAuth }) {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/users", {
        email: event.target[0].value,
        password: event.target[1].value,
        cidade: event.target[2].value,
        role,
        nome: event.target[3].value,
        sobrenome: event.target[4].value,
      });
      navigate("/");
      // setAuth(true);
    } catch (err) {
      console.log(err);
      setAuth(false);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h1>Registration</h1>
      <Form.Group className="my-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We&apos;ll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password (optional)</Form.Label>
        <Form.Control
          id="formBasicPassword"
          type="password"
          placeholder="Password"
        />
      </Form.Group>
      <Form.Label>City</Form.Label>
      <Form.Control type="text" placeholder="Enter your city" />
      <Form.Label>Name</Form.Label>
      <Form.Control type="text" placeholder="Enter your name" />
      <Form.Label>Last Name</Form.Label>
      <Form.Control type="text" placeholder="Enter your last name" />
      <Form.Group className="mb-3">
        <Form.Label>Which one of the below are you?</Form.Label>
        <Form.Check
          type="radio"
          value="estudante"
          onClick={(e) => setRole(e.target.value)}
          checked={role === "estudante"}
          label="Student"
        />
        <Form.Check
          type="radio"
          value="visitante"
          onClick={(e) => setRole(e.target.value)}
          checked={role === "visitante"}
          label="Visitor"
        />
        <Form.Check
          type="radio"
          value="professor"
          onClick={(e) => setRole(e.target.value)}
          checked={role === "professor"}
          label="Teacher"
        />
      </Form.Group>
      <Row>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Row>
    </Form>
  );
}

export default Register;
