import { Link } from "react-router-dom";
import styled from "styled-components";
import { ISidebar } from "./sidebar-items";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background};
  width: 20rem;
  padding: 1rem;
`;

const Item = styled(Link)`
  color: ${(props) => props.theme.fontDimmed};
  padding: 1rem;
  background-color: ${(props) => props.theme.background};
`;

function Sidebar({ items }: { items: ISidebar[] }) {
  return (
    <Wrapper>
      {items.map((item, index) => (
        <Item key={index} to={item.path}>
          {item.name}
        </Item>
      ))}
    </Wrapper>
  );
}

export default Sidebar;
