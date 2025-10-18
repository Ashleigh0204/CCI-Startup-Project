import Button from "../../components/Button"
import { useState } from "react"
import ViewTransactionModal from "./ViewTransactionModal";
import AdjustBudgetModal from "./AdjustBudgetModal";
import AddTransactionModal from "./AddTransactionModal";

export default function Budget({spent, budget, timeUnit}) {
    const [viewTransactionsModalOpen, setViewTransactionModalOpen] = useState(false);
    const [adjustBudgetModalOpen, setAdjustBudgetModalOpen] = useState(false);
    const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
    return (
        <div>
            <p className="text-lg">You have spent ${spent} this {timeUnit}.</p>
            <p>You have ${budget-spent} left in your budget.</p>
            <div className="flex justify-center">
                <Button className="w-full m-5" onClick={() => setAddTransactionModalOpen(true)}>Add Transaction</Button>
            </div>
            <div className="flex justify-between mt-3">
                <Button onClick={() => setViewTransactionModalOpen(true)}>View Transactions</Button>
                <Button onClick={() => setAdjustBudgetModalOpen(true)}>Adjust Budget</Button>
            </div>
            {viewTransactionsModalOpen && <ViewTransactionModal onRequestClose={()=> setViewTransactionModalOpen(false)} onSubmit={() => setViewTransactionModalOpen(false)} cancel={false}/>}
            {adjustBudgetModalOpen && <AdjustBudgetModal onRequestClose={() => setAdjustBudgetModalOpen(false)} onSubmit={() => setAdjustBudgetModalOpen(false)} cancel={true} />}
            {addTransactionModalOpen && <AddTransactionModal onRequestClose={() => setAddTransactionModalOpen(false)} onSubmit={() => setAddTransactionModalOpen(false)} cancel={true} locations={["Wendy's", "Chick-fil-A", "Crown Restaurant"]} />}
        </div>
    )
}