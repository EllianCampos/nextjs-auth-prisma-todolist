'use client'

import CustomButton from "@/components/CustomButton"
import FilterButtons from "@/components/FilterButtons"
import TableTasks from "@/components/TableTasks"
import { useEffect, useState } from "react"

export default function Home() {

  const [tasks, setTasks] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTasks = () => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data)
        setAllTasks(data)
      })
  }

  const fetchStates = () => {
    fetch('/api/states')
      .then(res => res.json())
      .then(res => setStates(res))
  }

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(res => setCategories(res))
  }

  useEffect(() => {
    fetchTasks()
    fetchStates()
    fetchCategories()
  }, [])

  const filterByState = (id) => {
    let datafiltered = allTasks.filter(task => task.state.idState == id)
    setTasks(datafiltered)
  }

  const filterByCategory = (id) => {
    let datafiltered = allTasks.filter(task => task.category.idCategory == id)
    setTasks(datafiltered)
  }

  return (
    <main className="container mt-3">
      <div className="d-flex justify-content-end my-3" >
        <CustomButton 
          color={'outline-warning'} 
          action={() => setTasks(allTasks)} 
          text={'Mostrar todas las tareas'} 
        />
      </div>
      <div className="accordion" id="accordionPanelsStayOpenTasks">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button className="accordion-button bg-dark text-warning" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne">
              Filtros
            </button>
          </h2>
          <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
            <div className="accordion-body bg-black">
              <FilterButtons items={states} filter={filterByState} setTasks={setTasks} allTasks={allTasks} />
              <hr />
              <FilterButtons items={categories} filter={filterByCategory} setTasks={setTasks} allTasks={allTasks} />
            </div>
          </div>
        </div>
      </div>
      <TableTasks tasks={tasks} />
    </main>
  );
}