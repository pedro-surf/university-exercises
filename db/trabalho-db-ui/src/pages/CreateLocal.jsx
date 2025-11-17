/* eslint-disable react/prop-types */
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../api";
import { useNavigate } from "react-router-dom";

function CreateLocal() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/local", {
        nome: event.target[0].value,
        sala: event.target[1].value,
        endereco: event.target[2].value,
        capacidade: event.target[3].value,
      });
      // setAuth(true);
      navigate("/locals");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h1>Create location</h1>
      <Form.Group className="mb-3">
        <Form.Label>Local name</Form.Label>
        <Form.Control
          id="title"
          type="text"
          placeholder="UFSC - Campus Araranguá"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Room</Form.Label>
        <Form.Control id="Room" type="text" placeholder="Room.." />
      </Form.Group>
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control id="address" as="textarea" placeholder="Address.." />
      </Form.Group>
      <Form.Group>
        <Form.Label>Capacity</Form.Label>
        <Form.Control id="capacity" type="number" placeholder="40" />
      </Form.Group>
      <Row>
        <Button variant="primary" className="mb-3" type="submit">
          Submit
        </Button>
        <Button onClick={() => navigate("/")} variant="secondary">
          Cancel
        </Button>
      </Row>
    </Form>
  );
}

export default CreateLocal;
