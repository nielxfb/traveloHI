import { Link } from "react-router-dom";
import styled from "styled-components";

const MenuItem = styled(Link)`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.fontDimmed};
  padding: 0.5rem 1rem;
`;

export default MenuItem;
