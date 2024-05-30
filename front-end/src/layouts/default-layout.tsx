import styled from "styled-components";
import { IChildren } from "../interfaces/children-interface";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: ${(props) => props.theme.secondary};
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    overflow-y: auto;
    padding-top: 2rem;
`;

const Content = styled.div`
    border: 0.125px solid ${(props) => props.theme.fontDimmed};
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    margin: 2rem;
`;

function DefaultLayout({ children }: IChildren) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

export default DefaultLayout;
