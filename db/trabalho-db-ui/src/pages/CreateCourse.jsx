/* eslint-disable react/prop-types */
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DateSelect from "../components/DateSelect";
import LocationSelect from "../components/LocalSelect";

function CreateCourse() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [start_at, setStart_at] = useState(null);
  const [end_at, setEnd_at] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/courses", {
        title: event.target[0].value,
        credit_hours: event.target[1].value,
        description: event.target[2].value,
        start_at,
        end_at,
        local_id: location,
      });
      navigate("/");
    } catch (err) {
      alert(err.response.data.error);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h1>Create course</h1>
      <Form.Group className="mb-3">
        <Form.Label>Event title</Form.Label>
        <Form.Control
          id="title"
          type="text"
          placeholder="My awesome course.."
        />
      </Form.Group>
      <Form.Label>Credit hours</Form.Label>
      <Form.Control id="credit_hours" type="number" />
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          id="description"
          as="textarea"
          placeholder="Description.."
        />
      </Form.Group>
      <DateSelect label="Start date" value={start_at} setValue={setStart_at} />
      <DateSelect label="End date" value={end_at} setValue={setEnd_at} />
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

export default CreateCourse;
