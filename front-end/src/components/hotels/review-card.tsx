import styled from "styled-components";
import { Review } from "../../pages/hotel-detail-page";
import { CiUser } from "react-icons/ci";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  gap: 1rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
  box-shadow: ${(props) => props.theme.shadow};
  min-width: 80%;
`;

const User = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: left;
`;

function ReviewCard({ review }: { review: Review }) {
  console.log(review.IsAnonymous)
  return (
    <Wrapper>
      <h3>Rating: {review.Rating}</h3>
      <h2>{review.ReviewDesc}</h2>
      <User>
        <CiUser />
        {review.IsAnonymous ? "Anonymous" : review.UserID}
      </User>
    </Wrapper>
  );
}

export default ReviewCard;
