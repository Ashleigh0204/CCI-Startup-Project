import { useState, useEffect } from "react";
import Button from "../../../components/Button.jsx";
import ViewRecipeModal from "./ViewRecipeModal";
import BuyIngredientsModal from "./BuyIngredientsModal";

export default function Recipe() {
    const [viewRecipeModalOpen, setViewRecipeModalOpen] = useState(false);
    const [buyIngredientsModalOpen, setBuyIngredientsModalOpen] = useState(false);
    const [recipeData, setRecipeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const FIXED_USER_ID = '507f1f77bcf86cd799439011';
    const randomPrompt = Math.random().toString(36).substring(2, 8); 


    const fetchRecipeData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8080/api/recipe`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: FIXED_USER_ID, prompt: randomPrompt }),
            });
            const data = await response.json();
            
            if (data.success && data.data) {
                setRecipeData(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch recipe data');
            }
        } catch (err) {
            console.error('Error fetching recipe data:', err);
            setError(err.message || 'Failed to load recipe data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchRecipeData();
        }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!recipeData) return <p>No recipe data found</p>;
    return (
        <div>
            {console.log(recipeData)}
            <h1 className="font-bold text-black">{recipeData.name}</h1>
            <p>{recipeData.summary}</p>
            <div className="flex justify-between mt-4">
                <Button variant="primary" onClick={() => setViewRecipeModalOpen(true)}>View Recipe</Button>
                <Button variant="primary" onClick={() => setBuyIngredientsModalOpen(true)}>Buy Ingredients</Button>
            </div>
            {viewRecipeModalOpen && <ViewRecipeModal onRequestClose={()=> setViewRecipeModalOpen(false)} onSubmit={() => setViewRecipeModalOpen(false)} cancel={false} recipe={recipeData}/>}
            {buyIngredientsModalOpen && <BuyIngredientsModal onRequestClose={()=> setBuyIngredientsModalOpen(false)} onSubmit={() => setBuyIngredientsModalOpen(false)} cancel={true} recipe={recipeData}/>}
        </div>
    )
}