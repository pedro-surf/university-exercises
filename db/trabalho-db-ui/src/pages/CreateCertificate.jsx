/* eslint-disable react/prop-types */
import { Row, Button, Form } from "react-bootstrap";
import axios from "../api";
import { useNavigate, useParams } from "react-router-dom";
import StudentSelect from "../components/StudentSelect";
import { useState } from "react";

function CreateCertificate() {
  const [usuario_id, setUsuario] = useState("");
  const navigate = useNavigate();
  const { type, id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credit_hours = event.target.elements.creditHours.value;
    const degree_name = event.target.elements.degreeName.value;
    try {
      await axios.post("/certificates", {
        usuario_id,
        credit_hours,
        degree_name,
        type,
        id,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h1>Create certificate</h1>
      <StudentSelect value={usuario_id} setValue={setUsuario} />
      <Form.Group className="mb-3">
        <Form.Label>Credit Hours</Form.Label>
        <Form.Control id="creditHours" type="number" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control id="degreeName" type="text" />
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

export default CreateCertificate;
