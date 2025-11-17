/* eslint-disable react/prop-types */
import { Row, Button, Form } from "react-bootstrap";
import axios from "../api";
import { useNavigate, useParams } from "react-router-dom";
import StudentSelect from "../components/StudentSelect";
import { useState } from "react";

function CreatePresenca() {
  const [usuario_id, setUsuario] = useState("");
  const navigate = useNavigate();
  const { type, id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/frequency", {
        usuario_id,
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
      <h1>Register {type} frequency</h1>
      <StudentSelect value={usuario_id} setValue={setUsuario} />
      <p>Today is {new Date().toLocaleDateString("pt-BR")}</p>
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

export default CreatePresenca;
