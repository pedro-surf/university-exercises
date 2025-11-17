/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Form,
} from "react-bootstrap";
import axios from "../api";

const StudentSelect = ({ value, setValue }) => {
  const [data, setData] = useState([]);

  // Fetch certificates and students on initial render
  useEffect(() => {
    axios.get("/local").then((response) => {
      setData(response.data.locais);
    });
  }, []);

  return (
    <Form.Group className="mb-3" controlId="estudanteId">
      <Form.Label>Location</Form.Label>
      <Form.Control
        as="select"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        <option value="">Select a location</option>
        {data.map((estudante) => (
          <option key={estudante.local_id} value={estudante.local_id}>
            {estudante.nome} {estudante.sala}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default StudentSelect;
