import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

export const BackButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;

  &:hover {
    background-color: #ccc;
  }
`;

export const RouteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;

  div {
    margin-right: 5px;
  }
`;

export const StopTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

export const TableData = styled.td`
  padding: 15px;
  text-align: left;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;
