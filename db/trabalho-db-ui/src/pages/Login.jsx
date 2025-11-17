/* eslint-disable react/prop-types */
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import axios, { setToken } from "../api";

function Login({ setAuth, setUser }) {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("/auth", {
        email: event.target[0].value,
        password: event.target[1].value,
      });
      if (res.data.accessToken) {
        // toDo: proper token handling
        setAuth(true);
        console.log(res.data);
        setUser(res.data);
        setToken(res.data.accessToken);
      }
    } catch (err) {
      console.log(err);
      setAuth(false);
    }
  };
  return (
    <Form className="d-flex flex-column" onSubmit={handleSubmit}>
      <h1>Welcome, please login.</h1>
      <Form.Group className="my-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Row>
        <Button className="mb-3" variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="secondary" onClick={() => navigate("/register")}>
          Register
        </Button>
      </Row>
    </Form>
  );
}

export default Login;
