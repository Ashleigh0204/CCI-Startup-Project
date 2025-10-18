import Modal from "../components/Modal/Modal"
import ModalTitle from "../components/Modal/ModalTitle"
import ModalContent from "../components/Modal/ModalContent"
export default function AdjustBudgetModal({onRequestClose, onSubmit, cancel, locations}) {
    return (
        <Modal onRequestClose={onRequestClose} onSubmit={onSubmit} cancel={cancel}>
            <ModalTitle>
                Add Transaction
            </ModalTitle>
            <ModalContent>
                <form onSubmit={onSubmit}>
                <div className="m-2">
                    <label for="amount" name="amount">$</label>
                    <input type="number" required name="amount" className="ml-2 border border-gray-300 rounded p-2 w-2/3" />
                </div>
                <div className="m-2">
                    <label for="location" name="location">Location:  </label>
                    <select name="location" className="ml-2 border border-gray-300 rounded p-2 w-2/3">
                        {locations.map((location, index) => <option key={index} value={location}>{location}</option>)}
                    </select>
                </div>
                </form>
            </ModalContent>
        </Modal>
    )
}