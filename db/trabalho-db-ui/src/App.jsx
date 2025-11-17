import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CourseList from "./pages/CoursesList";
import StudentList from "./pages/StudentList";
import InstructorList from "./pages/InstructorList";
import EventsList from "./pages/EventsList"; //
import ProjectsList from "./pages/ProjectsList"; //
import Certificates from "./pages/CertificatesList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import CreateCertificate from "./pages/CreateCertificate";
import CreateEvent from "./pages/CreateEvent";
import CreateCourse from "./pages/CreateCourse";
import LocaisList from "./pages/LocaisList";
import CreateLocal from "./pages/CreateLocal";
import CreatePresenca from "./pages/CreatePresenca";
import ChangePassword from "./pages/ChangePassword";
import VisitorList from "./pages/VisitorList";
import CertificatesHighscoresList from "./pages/CertificatesHighscoresList";
import ProfessorsHighscoresList from "./pages/ProfessorsHighscoresList";

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route
            exact
            path="/"
            element={
              auth ? (
                <Dashboard {...user} />
              ) : (
                <Login setAuth={setAuth} setUser={setUser} />
              )
            }
          />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/instructors" element={<InstructorList />} />
          <Route path="/visitantes" element={<VisitorList />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/available" element={<ProjectsList type="available" />} />
          <Route path="/projects/subscribed" element={<ProjectsList type="subscribed" />} />
          <Route path="/courses/available" element={<CourseList type="available" />} />
          <Route path="/courses/subscribed" element={<CourseList type="subscribed" />} />
          <Route path="/events/available" element={<EventsList type="available" />} />
          <Route path="/events/subscribed" element={<EventsList type="subscribed" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ChangePassword {...user} />} />
          {user?.role === "professor" && (
            <>
              <Route exact path="/courses/create" element={<CreateCourse />} />
              <Route exact path="/certificates/create/:type/:id" element={<CreateCertificate />} />
              <Route path="/winners" element={<CertificatesHighscoresList />} />
              <Route path="/instructors/winners" element={<ProfessorsHighscoresList />} />
              <Route exact path="/frequency/:type/:id" element={<CreatePresenca />} />
              <Route exact path="/events/create" element={<CreateEvent />} />
              <Route exact path="/projects/create" element={<CreateProject />} />
              <Route exact path="/locals" element={<LocaisList />} />
              <Route exact path="/locals/create" element={<CreateLocal />} />
            </>
          )}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
