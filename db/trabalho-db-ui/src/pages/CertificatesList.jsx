import { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import axios from "../api";
import { useNavigate } from "react-router-dom";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  // Fetch certificates and students on initial render
  useEffect(() => {
    axios.get("/certificates").then((response) => {
      setCertificates(response.data.certificates);
    });
  }, []);

  return (
    <Container>
      <h1>Certificates</h1>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Degree Name</th>
            <th>Total Credit Hours</th>
            <th>Student Name</th>
            <th>Date of Issue</th>
            <th>Event</th>
            <th>Project</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.diploma_id}>
              <td>{certificate.degree_name}</td>
              <td>{certificate.credit_hours}</td>
              <td>
                {certificate.owner.nome}{" "}
                {certificate.owner.sobrenome}
              </td>
              <td>
                {new Date(certificate.created_at).toLocaleDateString()}
              </td>
              <td>{certificate.evento?.title}</td>
              <td>{certificate.projeto?.title}</td>
              <td>{certificate.curso?.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => navigate("/")}>Go back</Button>
    </Container>
  );
};

export default Certificates;
