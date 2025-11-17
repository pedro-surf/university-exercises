/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "../api";
import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AiOutlineProfile } from "react-icons/ai";
import { HiOutlineUserRemove } from "react-icons/hi";

function ProjectList({ type }) {
  const [courses, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let url = "/projects";
    if (type) {
      url += `/${type}`;
    }
    axios
      .get(url)
      .then((response) => setProjects(response.data.courses))
      .catch((error) => console.error(error));
  }, [type]);

  const handleSubscribe = (id) => {
    axios.post(`/projects/${id}/subscription`).then(() => {
      navigate("/");
    });
  };

  const handleUnsubscribe = (id) => {
    axios.delete(`/projects/${id}/unsubscribe`).then(() => {
      navigate("/");
    });
  };

  return (
    <Container>
      <h1>Projects</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <th>Description</th>
            <th>Capacity</th>
            {type === "available" && <th>Subscribe</th>}
            {type === "subscribed" && <th>Unsubscribe</th>}
            {!type && (
              <>
                <th>Add Frequency</th>
                <th>Create Certificate</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {courses.map((project) => (
            <tr key={project.projeto_id}>
              <td>{project.title}</td>
              <td>{new Date(project.start_at).toLocaleDateString("pt-BR")}</td>
              <td>{new Date(project.end_at).toLocaleDateString("pt-BR")}</td>
              <td>
                {project.local?.nome} {project.local?.sala}
              </td>
              <td>{project.description}</td>
              <td>
                {project.count}/{project?.local?.capacidade}
              </td>
              {type === "available" && (
                <td>
                  {project?.local?.capacidade > project.count ? (
                    <AiOutlineUserAdd
                      role="button"
                      onClick={() => handleSubscribe(project.projeto_id)}
                    />
                  ) : (
                    "Lotado"
                  )}
                </td>
              )}
              {type === "subscribed" && (
                <td>
                  <HiOutlineUserRemove
                    role="button"
                    onClick={() => handleUnsubscribe(project.projeto_id)}
                  />
                </td>
              )}
              {!type && (
                <>
                  <td>
                    <AiOutlineUsergroupAdd // AiOutlineUserAdd
                      role="button"
                      onClick={() =>
                        navigate(`/frequency/projects/${project.projeto_id}`)
                      }
                    />
                  </td>
                  <td>
                    <AiOutlineProfile //AiOutlineUserAdd
                      role="button"
                      onClick={() =>
                        navigate(
                          `/certificates/create/projects/${project.projeto_id}`
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

export default ProjectList;
