import styled from "styled-components";
import { IChildren } from "../interfaces/children-interface";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${(props) => props.theme.secondary};
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 0.125px solid ${(props) => props.theme.fontDimmed};
  background-color: ${(props) => props.theme.background};
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

function CenterizedContent({ children }: IChildren) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

export default CenterizedContent;
