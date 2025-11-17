import { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from "../api";
import { useNavigate } from "react-router-dom";

function VisitorList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //axios.get('/users/estudantes')
    axios
      .get("/users/visitantes")
      .then(response => setStudents(response.data.users))
      .catch(error => console.log(error));
  }, []);

  return (
    <Container>
      <h1 className="text-center my-5">Visitor List</h1>
      <Button className="my-3" variant="primary" onClick={() => navigate("/")}>Go back</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {students.map(visitor => (
            <tr key={visitor.usuario_id}>
              <td>{visitor.usuario_id}</td>
              <td>{visitor.nome}</td>
              <td>{visitor.sobrenome}</td>
              <td>{visitor.email}</td>
              <td>{visitor.cidade}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default VisitorList;