import StyledLink from "../components/form/styled-link"
import CenterizedContent from "../layouts/centerized-content"

function NotFound() {
  return (
    <CenterizedContent>
        <h1>404 - Not Found</h1>
        <StyledLink to="/">Back to Home</StyledLink>
    </CenterizedContent>
  )
}

export default NotFound