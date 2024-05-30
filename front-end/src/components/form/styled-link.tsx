import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  background-color: ${(props) => props.theme.secondary};
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  text-align: center;

  &:hover {
    background-color: ${(props) => props.theme.accent};
    transition: 0.3s ease-in-out;
  }
`;

export default StyledLink;
