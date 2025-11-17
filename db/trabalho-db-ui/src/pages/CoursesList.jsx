/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "../api";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";

function CourseList({ type }) {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let url = "/courses";
    if (type) {
      url += `/${type}`;
    }
    axios
      .get(url)
      .then((response) => setCourses(response.data.courses))
      .catch((error) => console.error(error));
  }, [type]);

  const handleSubscribe = (id) => {
    axios.post(`/courses/${id}/subscription`).then(() => {
      navigate("/");
    });
  };

  return (
    <Container>
      <h1>Courses</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Credit Hours</th>
            <th>Description</th>
            <th>Location</th>
            <th>Start date</th>
            <th>End date</th>
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
          {courses.map((course, idx) => (
            <tr key={course.curso_id}>
              <td>{idx + 1}</td>
              <td>{course.title}</td>
              <td>{course.credit_hours}</td>
              <td>{course.description}</td>
              <td>
                {course.local?.nome} {course.local?.sala}
              </td>
              <td>{new Date(course.start_at).toLocaleDateString("pt-BR")}</td>
              <td>{new Date(course.end_at).toLocaleDateString("pt-BR")}</td>
              {type === "available" && (
                <td>
                  {course?.local?.capacidade > course.count ? (
                    <AiOutlineUserAdd
                      role="button"
                      onClick={() => handleSubscribe(course.curso_id)}
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
                        navigate(`/frequency/courses/${course.curso_id}`)
                      }
                    />
                  </td>
                  <td>
                    <AiOutlineUserAdd
                      role="button"
                      onClick={() =>
                        navigate(
                          `/certificates/create/projects/${course.curso_id}`
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

export default CourseList;
