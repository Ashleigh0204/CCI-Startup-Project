import Modal from "../../components/Modal/Modal";
import ModalContent from "../../components/Modal/ModalContent";
import ModalTitle
 from "../../components/Modal/ModalTitle";
export default function ViewTransactionModal({onRequestClose, onSubmit, cancel}) {
    return (
        <Modal onRequestClose={onRequestClose} onSubmit={onSubmit} cancel={cancel}>
            <ModalTitle>
                Recent Transactions
            </ModalTitle>
            <ModalContent>
                We see a table with all the transactions here
            </ModalContent>
        </Modal>
    )
}