import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface DropdownProps {
  visible: boolean;
  history: string[];
  recommendations: string[];
  setSelected: Dispatch<SetStateAction<string>>;
}

const Wrapper = styled.div`
  position: absolute;
  top: 3rem;
  left: 11rem;
  width: 33%;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.font};
  border: 1px solid ${(props) => props.theme.fontDimmed};
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 1000;
`;

const ListItem = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.font};

  &:hover {
    background-color: ${(props) => props.theme.accent};
  }
`;

const Title = styled.h1`
  padding: 0.5rem;
  font-size: 1.5rem;
  color: ${(props) => props.theme.fontDimmed};
`;

function Dropdown({
  visible,
  history,
  recommendations,
  setSelected
}: DropdownProps): JSX.Element {
    const navigate = useNavigate();

  return visible ? (
    <Wrapper>
      <Title>History</Title>
      {history.map((item, index) => (
        <ListItem key={index} onClick={() => {navigate(`/search/${item}`)}}>
          {item}
        </ListItem>
      ))}
      <Title>Recommendation</Title>
      {recommendations.map((item, index) => (
        <ListItem key={index} onClick={() => {navigate(`/search/${item}`)}}>
          {item}
        </ListItem>
      ))}
    </Wrapper>
  ) : (
    <div></div>
  );
}

export default Dropdown;
