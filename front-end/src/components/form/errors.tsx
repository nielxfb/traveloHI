import styled from "styled-components";

const Wrapper = styled.div`
  color: ${(props) => props.theme.error};
  font-weight: 500;
  text-align: center;
`;

function Error({ error }: { error: string }) {
  return <Wrapper>{error}</Wrapper>;
}

export default Error;
