'use client'

import { useState, useEffect } from "react";

export default function CrudSettings({ title, route }) {

  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [onError, setOnError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const get = () => {
    fetch(`/api/${route}`)
    .then(res => res.json())
    .then(res => {
      const newData = []

      for (const item of res) {
        newData.push({
          id: Object.values(item)[0],
          name: item.name
        })
      }

      setData(newData)
    })
  };

  useEffect(() => {
    get();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    

    if (name.trim() == "") {
      setOnError(true);
      setErrorMessage("Ingresa el nombre");
      return;
    }

    fetch(`/api/${route}/${editMode ? id : ""}`, {
      method: editMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
    .then(res => {
      if (res.status === 201 || res.status === 200) {
        return res.json()
      } else {
        return null
      }
    })
    .then(res => {
      const resObj = Object.values(res)[1]
      const resId = Object.values(resObj)[0]
      const resName = Object.values(resObj)[1]

      if (editMode) {
        const temp = [...data];
        const item = temp.find((item) => item.id === id);
        item.name = resName;
        setData(temp);
      } else {
        setData([...data, { id: resId, name: resName }]);
      }

      setName("");
      setEditMode(false);
      setOnError(false);
      setErrorMessage("");
    })

    setName("");
    setEditMode(false);
    setOnError(false);
    setErrorMessage("");
  };

  const handleDelete = (event) => {
    event.preventDefault()

    fetch(`/api/${route}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.status === 200) {
          setData(prevData => {
            const temp = prevData.filter(item => item.id !== id)
            setName('')
            setEditMode(false)
            return temp
          })
        }
      })
  };

  return (
    <div className="col-12 col-sm-6 mt-4">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit} >
        {onError && <div className="alert alert-danger ">{errorMessage}</div>}
        <label className="form-label">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="form-control"
        />
        <button
          className={`btn ${editMode ? 'btn-warning' : 'btn-success'}  mt-2`}
          type="submit"
        >
          Guardar
        </button>
        {editMode && <button onClick={handleDelete} className="btn btn-danger mt-2 ms-2">
          Eliminar
        </button>}
      </form>
      <table className="table table-dark mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td className="text-end">
                {editMode ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      setId(item.id);
                      setName(item.name);
                      setEditMode(true);
                      setOnError(false);
                      setErrorMessage("");
                    }}
                    className='btn btn-primary'
                  >
                    Seleccionar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}