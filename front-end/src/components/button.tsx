import styled from "styled-components";

const Button = styled.button`
  background-color: ${(props) => props.theme.secondary};
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.accent};
    transition: 0.3s ease-in-out;
  }
`;

export default Button;
