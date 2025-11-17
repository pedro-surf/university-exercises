import { useState, useEffect } from "react";
import axios from "../api";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/users/instructors").then((response) => {
      setInstructors(response.data.users);
    });
  }, []);
 
  return (
    <div>
      <h1>Professores</h1>
      <Button variant="primary" onClick={() => navigate("/")}>Go back</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Instructor ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor.usuario_id}>
              <td>{instructor.usuario_id}</td>
              <td>{instructor.nome}</td>
              <td>{instructor.sobrenome}</td>
              <td>{instructor.email}</td>
              <td>{instructor.cidade}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default InstructorsList;
