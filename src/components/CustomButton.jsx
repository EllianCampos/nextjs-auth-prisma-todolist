export default function CustomButton({ color, action, text }) {
    return (
        <button 
            className={`btn btn-${color}`}
            onClick={() => action()}
        >
            {text}
        </button>
    )
}