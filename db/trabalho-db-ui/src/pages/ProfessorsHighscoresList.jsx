import { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from "../api";
import { useNavigate } from "react-router-dom";

function CertificatesHighscoresList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/users/most-attended")
      .then(response => setData(response.data.users))
      .catch(error => console.log(error));
  }, []);

  return (
    <Container>
      <h1 className="text-center my-5">Professors whose events had most attendance this year</h1>
      <Button className="my-3" variant="primary" onClick={() => navigate("/")}>Go back</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Professor</th>
            <th>Certificates Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.usuario_id}>
              <td>{d.nome} {d.sobrenome}</td>
              <td>{d.total_presencas}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default CertificatesHighscoresList;