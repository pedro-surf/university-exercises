/* eslint-disable react/prop-types */
import { MdEventSeat } from "react-icons/md";
import { GrWorkshop, GrUserSettings, GrCertificate } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { BiLocationPlus } from "react-icons/bi";
import { Col, Container, Card, Row } from "react-bootstrap";
import { RiUserSharedLine } from "react-icons/ri";

const cards = [
  {
    title: "Projects",
    icon: <GrWorkshop />,
    url: "/projects",
  },
  {
    title: "Courses",
    icon: <GrWorkshop />,
    url: "/courses",
  },
  {
    title: "Events",
    icon: <MdEventSeat />,
    url: "/events",
  },
];

function Item({ title, icon, text, url }) {
  const router = useNavigate();
  return (
    <Col xs={12} md={6}>
      <Card onClick={() => router(url)} className="m-2" role="button">
        <Card.Body>
          <Card.Title>{icon}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{title}</Card.Subtitle>
          <Card.Text>{text || `Browse through your ${title}`}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

const Dashboard = ({ ...user }) => {
  if (!user) {
    return null;
  }
  if (user.role === "professor") {
    return (
      <Container>
        <h1>Welcome, professor!</h1>
        <Container className="mt-3 d-flex">
          <Row>
            <h3>Create new item</h3>
            {cards.map((card, idx) => (
              <Item
                key={idx}
                {...card}
                text={`Create ${card.title}`}
                url={card.url + "/create"}
              />
            ))}
            <h3 className="mt-4">See existing items</h3>
            {cards.map((card, idx) => (
              <Item key={idx} {...card} text={`All ${card.title}`} />
            ))}
            <Item
              key="local"
              title="Locais"
              icon={<BiLocationPlus />}
              url="/locals"
              text="See All Locations"
            />
            <Item title="Profile" icon={<GrUserSettings />} url="/profile" />
            <Item
              title="Users with more certificates"
              icon={<RiUserSharedLine />}
              text="See users with more certificates"
              url="/winners"
            />
            <Item
              title="Instructors with more attended events"
              icon={<RiUserSharedLine />}
              text="See instructors with more attended events"
              url="/instructors/winners"
            />
            <Item
              title="See students"
              icon={<RiUserSharedLine />}
              text="Students list"
              url="/students"
            />
            <Item
              title="See instructors"
              icon={<RiUserSharedLine />}
              text="Professors list"
              url="/instructors"
            />
            <Item
              title="See students"
              icon={<RiUserSharedLine />}
              text="Students list"
              url="/students"
            />
            <Item
              title="See visitors"
              icon={<RiUserSharedLine />}
              text="visitors list"
              url="/visitantes"
            />
          </Row>
        </Container>
      </Container>
    );
  }
  return (
    <Container>
      <h1>Welcome, {user.nome}</h1>
      <h5>Logged in as {user.email}</h5>
      <Container className="mt-3 d-flex">
        <Row>
          {cards.map((card, idx) => (
            <Item key={idx} {...card} url={card.url + "/subscribed"} />
          ))}
          <Item
            title="Certificates"
            icon={<GrCertificate />}
            url="/certificates"
          />
          <Item title="Profile" icon={<GrUserSettings />} url="/profile" />
          <h3 className="mt-4">Find new things to sign up for</h3>
          {cards.map((card, idx) => (
            <Item
              key={idx}
              {...card}
              text={`Find ${card.title}`}
              url={card.url + "/available"}
            />
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default Dashboard;
