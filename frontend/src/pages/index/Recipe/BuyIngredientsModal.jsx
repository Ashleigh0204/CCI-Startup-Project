import Modal from "../../components/Modal/Modal";
import ModalContent from "../../components/Modal/ModalContent";
import ModalTitle
 from "../../components/Modal/ModalTitle";
export default function BuyIngredientsModal({onRequestClose, onSubmit, cancel, recipe}) {
    return (
        <Modal onRequestClose={onRequestClose} onSubmit={onSubmit} cancel={cancel}>
            <ModalTitle>
                {recipe.name} Ingredients
            </ModalTitle>
            <ModalContent>
                <div>
                {recipe.ingredients.map((item,index) => <div key={index}>
                    <div className="flex justify-between">
                        <div>{item.amount} {item.name}</div>
                        <div>${item.price.toFixed(2)}</div>
                    </div>
                </div>)}
                </div>
                <div className="border-t border-gray-200 my-4 py-2 flex justify-between font-bold">
                    <div>Total</div>
                    <div>${recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0).toFixed(2)}</div>
                </div>
              
            </ModalContent>
        </Modal>
    )
}