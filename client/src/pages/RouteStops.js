import React from "react";
import { useNavigate, useLocation} from "react-router-dom";
import styled from "styled-components";
import { Container, BackButton, RouteInfo, StopTable, TableRow, TableData, StyledLink } from "../styles/RouteStops.styled";

const RouteStops = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, route, direction, stops } = location.state || {};

  const handleBackClick = () => {
    navigate("/lookup-schedule");
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBackClick}>Back</BackButton>
        <RouteInfo>
          <div>{date}</div>
          <div>{route}</div>
          <div>{`Direction ${direction}`}</div>
        </RouteInfo>
      </Header>
      <StopTable>
        <tbody>
          {stops.map((stop, index) => (
            <TableRow key={index}>
              <TableData>
                <StyledLink to="#">{stop}</StyledLink>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </StopTable>
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

export default RouteStops;
