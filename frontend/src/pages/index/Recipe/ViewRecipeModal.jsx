import Modal from "../../../components/Modal/Modal"
import ModalContent from "../../../components/Modal/ModalContent";
import ModalTitle from "../../../components/Modal/ModalTitle";

export default function ViewRecipeModal({onRequestClose, onSubmit, cancel, recipe}) {
    return (
        <Modal onRequestClose={onRequestClose} onSubmit={onSubmit} cancel={cancel}>
            <ModalTitle>
                {recipe.name}
            </ModalTitle>
            <ModalContent className="max-h-80 overflow-y-auto">
                <h2 className="font-bold">Ingredients:</h2>
                <ul>
                    {recipe.ingredients.map((item, key) => <li key={key}>{item.amount} {item.name}</li>)}
                </ul>
                <h2 className="font-bold">Steps:</h2>
                <div>
                    {recipe.steps.map((item,key) => <div key={key}>{item}</div>)}
                </div>
            </ModalContent>
        </Modal>
    )
}