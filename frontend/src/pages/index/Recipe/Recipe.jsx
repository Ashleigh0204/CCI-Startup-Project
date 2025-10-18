import { useState } from "react";
import Button from "../../components/Button";
import ViewRecipeModal from "./ViewRecipeModal";
import BuyIngredientsModal from "./BuyIngredientsModal";

export default function Recipe({recipe}) {
    const [viewRecipeModalOpen, setViewRecipeModalOpen] = useState(false);
    const [buyIngredientsModalOpen, setBuyIngredientsModalOpen] = useState(false);
    return (
        <div>
            <h1 className="font-bold text-black">{recipe.name}</h1>
            <p>{recipe.summary}</p>
            <div className="flex justify-between mt-4">
                <Button onClick={() => setViewRecipeModalOpen(true)}>View Recipe</Button>
                <Button onClick={() => setBuyIngredientsModalOpen(true)}>Buy Ingredients</Button>
            </div>
            {viewRecipeModalOpen && <ViewRecipeModal onRequestClose={()=> setViewRecipeModalOpen(false)} onSubmit={() => setViewRecipeModalOpen(false)} cancel={false} recipe={recipe}/>}
            {buyIngredientsModalOpen && <BuyIngredientsModal onRequestClose={()=> setBuyIngredientsModalOpen(false)} onSubmit={() => setBuyIngredientsModalOpen(false)} cancel={true} recipe={recipe}/>}
        </div>
    )
}