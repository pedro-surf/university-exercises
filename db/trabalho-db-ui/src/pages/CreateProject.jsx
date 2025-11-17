/* eslint-disable react/prop-types */
import { Row } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import LocationSelect from "../components/LocalSelect";

function CreateProject() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null); // [value, setValue
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/projects", {
        title: event.target[0].value,
        description: event.target[1].value,
        start_at: event.target[2].value,
        end_at: event.target[3].value,
        local_id: location,
      });
      navigate("/");
    } catch (err) {
      alert(err.response.data.error);
      console.log(err);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h1>Create project</h1>
      <Form.Group className="mb-3">
        <Form.Label>Project title</Form.Label>
        <Form.Control
          id="title"
          type="text"
          placeholder="My awesome project.."
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          id="description"
          as="textarea"
          placeholder="Description.."
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Start date</Form.Label>
        <Form.Control id="start_at" type="date" placeholder="Start date.." />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>End date</Form.Label>
        <Form.Control id="end_at" type="date" placeholder="End date.." />
      </Form.Group>
      <LocationSelect
        id="location"
        value={location}
        setValue={(val) => setLocation(val)}
      />
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

export default CreateProject;
