/* eslint-disable react/prop-types */
import { Row, Button, Form } from "react-bootstrap";
import axios from "../api";
import { useNavigate } from "react-router-dom";

function ChangePassword({ ...user }) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/users/${user.usuario_id}`, {
        password: event.target[0].value,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h1>My profile</h1>
      <p>Name: {user?.nome}</p>
      <p>Email: {user?.email}</p>
      <p>City: {user?.cidade}</p>
      <h4 className="mt-5">Change password</h4>
      <Form.Group className="my-3" controlId="formBasicPassword">
        <Form.Label>New password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Row>
        <Button variant="primary" className="mb-3" type="submit">
          Submit
        </Button>
        <Button onClick={() => navigate("/")} variant="secondary">
          Go back
        </Button>
      </Row>
    </Form>
  );
}

export default ChangePassword;
