import styled from "styled-components";

interface IModal {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: ${(props) => props.theme.background};
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 800px;
  width: 100%;
`;

const CloseButton = styled.button`
  background-color: #ccc;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 10px;
`;

function Modal({ show, onClose, children }: IModal) {
  if (!show) {
    return null;
  }

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Close</CloseButton>
        {children}
      </ModalContainer>
    </Overlay>
  );
}

export default Modal;
