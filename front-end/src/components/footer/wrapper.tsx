import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  border-top: 0.1rem solid ${(props) => props.theme.footer};
  border-bottom: 0.1rem solid ${(props) => props.theme.footer};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.5rem;
`;

export default Wrapper;
