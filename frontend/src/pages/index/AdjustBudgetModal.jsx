import Modal from "../components/Modal/Modal"
import ModalTitle from "../components/Modal/ModalTitle"
import ModalContent from "../components/Modal/ModalContent"
export default function AdjustBudgetModal({onRequestClose, onSubmit, cancel}) {
    return (
        <Modal onRequestClose={onRequestClose} onSubmit={onSubmit} cancel={cancel}>
            <ModalTitle>
                Adjust Budget
            </ModalTitle>
            <ModalContent>
                <form onSubmit={onSubmit}>
                <div className="m-2">
                    <label for="budgetAmount" name="budgetAmount">$</label>
                    <input type="number" required name="budgetAmount" className="ml-2 border border-gray-300 rounded p-2 w-2/3" />
                </div>
                <div className="m-2">
                    <label for="timeUnit" name="timeUnit">Budget frequency:  </label>
                    <select name="timeUnit" className="ml-2 border border-gray-300 rounded p-2 w-2/3">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                </form>
            </ModalContent>
        </Modal>
    )
}