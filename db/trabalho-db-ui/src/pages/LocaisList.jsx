import { useEffect, useState } from "react";
import axios from "../api";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function EventsList() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
    .get("/local")
    .then((response) => setEvents(response.data.locais))
    .catch((error) => console.error(error));
    
  }, []);

  return (
    <Container>
      <h1>Locais</h1>
      <Button className="my-3"
       onClick={() => navigate("/locals/create")}>Create local</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Address</th>
            <th>Room</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.local_id}>
              <td>{event.nome}</td>
              <td>{event.endereco}</td>
              <td>{event.sala}</td>
              <td>{event.capacidade}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => navigate("/")}>Go back</Button>
    </Container>
  );
}

export default EventsList;
