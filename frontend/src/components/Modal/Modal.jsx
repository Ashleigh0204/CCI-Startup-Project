import Button from "../Button";
export default function Modal({onRequestClose, onSubmit, cancel, children, submitText = "OK"}) {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative z-50">            
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <img src="/icons8-close-50.png" className="h-4"/>
        </button>
            {children}
            <div className={`flex mt-4 ${cancel ? "justify-between" : "justify-end"}`}>
                {cancel && <Button variant="outline" className="" onClick={onRequestClose}>Cancel</Button> }
                <Button variant="primary" onClick={onSubmit}>{submitText}</Button>
            </div>
        </div>
        </div>
    )
}