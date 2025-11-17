import { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from "../api";
import { useNavigate } from "react-router-dom";

function StudentsList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/users/estudantes")
      .then(response => setStudents(response.data.users))
      .catch(error => console.log(error));
  }, []);

  return (
    <Container>
      <h1 className="text-center my-5">Students List</h1>
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
          {students.map(student => (
            <tr key={student.usuario_id}>
              <td>{student.usuario_id}</td>
              <td>{student.nome}</td>
              <td>{student.sobrenome}</td>
              <td>{student.email}</td>
              <td>{student.cidade}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default StudentsList;