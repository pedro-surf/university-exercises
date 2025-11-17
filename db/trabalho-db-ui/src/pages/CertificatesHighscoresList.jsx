import { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from "../api";
import { useNavigate } from "react-router-dom";

function CertificatesHighscoresList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/certificates/winners-ararangua")
      .then(response => setData(response.data.certificates))
      .catch(error => console.log(error));
  }, []);

  return (
    <Container>
      <h1 className="text-center my-5">Certificates Highscores List in Araranguá in the last 6 months</h1>
      <Button className="my-3" variant="primary" onClick={() => navigate("/")}>Go back</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Certificates Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.owner.usuario_id}>
              <td>{d.owner.nome}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default CertificatesHighscoresList;