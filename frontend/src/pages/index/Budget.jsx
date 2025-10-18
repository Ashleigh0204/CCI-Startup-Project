import Button from "../components/Button"
export default function Budget({spent, budget, timeUnit}) {
    return (
        <div>
            <p className="text-lg">You have spent ${spent} this {timeUnit}.</p>
            <p>You have ${budget-spent} left in your budget.</p>
            <div className="flex justify-center">
                <Button className="w-full m-5">Add Transaction</Button>
            </div>
            <div className="flex justify-between mt-3">
                <Button>View Transactions</Button>
                <Button>Adjust Budget</Button>
            </div>
        </div>
    )
}