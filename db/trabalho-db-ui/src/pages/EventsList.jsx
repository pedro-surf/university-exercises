/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "../api";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";

function EventsList({ type }) {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let url = "/events";
    if (type) {
      url += `/${type}`;
    }
    axios
      .get(url)
      .then((response) => setEvents(response.data.events))
      .catch((error) => console.error(error));
  }, [type]);

  const handleSubscribe = (id) => {
    axios.post(`/events/${id}/subscription`).then(() => {
      navigate("/");
    });
  };

  return (
    <Container>
      <h1>Events</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <th>Description</th>
            {type === "available" && <th>Subscribe</th>}
            {!type && (
              <>
                <th>Add Frequency</th>
                <th>Create Certificate</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.evento_id}>
              <td>{event.title}</td>
              <td>{new Date(event.start_at).toLocaleDateString("pt-BR")}</td>
              <td>{new Date(event.end_at).toLocaleDateString("pt-BR")}</td>
              <td>
                {event.local?.nome} {event.local?.sala}
              </td>
              <td>{event.description}</td>{" "}
              {type === "available" && (
                <td>
                  {event?.local?.capacidade > event.count ? (
                    <AiOutlineUserAdd
                      role="button"
                      onClick={() => handleSubscribe(event.evento_id)}
                    />
                  ) : (
                    "Lotado"
                  )}
                </td>
              )}
              {!type && (
                <>
                  <td>
                    <AiOutlineUserAdd
                      role="button"
                      onClick={() =>
                        navigate(`/frequency/events/${event.evento_id}`)
                      }
                    />
                  </td>
                  <td>
                    <AiOutlineUserAdd
                      role="button"
                      onClick={() =>
                        navigate(
                          `/certificates/create/events/${event.evento_id}`
                        )
                      }
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => navigate("/")}>Go back</Button>
    </Container>
  );
}

export default EventsList;
