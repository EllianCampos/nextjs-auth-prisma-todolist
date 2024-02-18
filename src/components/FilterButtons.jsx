export default function FilterButtons({ items, filter, setTasks, allTasks }) {
    return (
        <section>
            {items.map(item => (
                <button 
                    key={Object.values(item)[0]} 
                    className="btn btn-secondary mx-2 my-1"
                    onClick={() => filter(Object.values(item)[0])}
                >
                    {item.name}
                </button>
            ))}
        </section>
    )
}