import styled from "styled-components";

const Input = styled.input`
  border-radius: 0.5rem;
  padding: 0.5rem 0.5rem;
  border: 0.125px solid ${(props) => props.theme.fontDimmed};
`;

export default Input;
