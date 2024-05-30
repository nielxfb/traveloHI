import styled from "styled-components";
import { IUser } from "../../interfaces/user-interface";
import Button from "../button";

const Wrapper = styled.div`
  display: flex;
  padding: 1rem;
  gap: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.fontDimmed};
  color: ${(props) => props.theme.font};
  background-color: ${(props) => props.theme.background};
`;

const Image = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

function Card({ user, handleBanUser }: { user: IUser, handleBanUser: (user: IUser) => void }) {

  return (
    <Wrapper>
      <Image>
        <img
          src={user.ProfilePictureLink}
          alt={`${user.FirstName}-${user.LastName}-ProfilePicture`}
        />
      </Image>
      <div>
        <h2>
          {user.FirstName} {user.LastName}
        </h2>
        <p>Email: {user.Email}</p>
        <p>DOB: {user.DOB.toLocaleDateString()}</p>
        <p>Role: {user.Role}</p>
        <p>Gender: {user.Gender}</p>
        <p>Login Status : {user.LoggedIn ? "Logged In" : "Logged Out"}</p>
        <p>Ban Status: {user.IsBanned ? "Banned" : "Not banned"}</p>
        {!user.IsBanned && <Button onClick={() => handleBanUser(user)}>Ban User</Button>}
      </div>
    </Wrapper>
  );
}

export default Card;
