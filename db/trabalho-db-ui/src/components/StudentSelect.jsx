/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Form,
} from "react-bootstrap";
import axios from "../api";

const StudentSelect = ({ value, setValue }) => {
  const [estudantes, setEstudantes] = useState([]);

  // Fetch certificates and students on initial render
  useEffect(() => {
    axios.get("/users/estudantes").then((response) => {
      setEstudantes(response.data.users);
    });
  }, []);

  return (
    <Form.Group className="mb-3" controlId="estudanteId">
      <Form.Label>Student</Form.Label>
      <Form.Control
        as="select"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        <option value="">Select a student</option>
        {estudantes.map((estudante) => (
          <option key={estudante.id} value={estudante.usuario_id}>
            {estudante.nome} {estudante.sobrenome}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default StudentSelect;
