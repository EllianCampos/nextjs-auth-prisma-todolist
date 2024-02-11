'use client'

import { useState, useEffect } from "react";

export default function CrudSettings({ title, route }) {

  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

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
      setError("Ingresa el nombre");
      return;
    }

    fetch(`/api/${route}/${editMode ? id : ""}`, {
      method: editMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.errorMessage) {
          setError(res.errorMessage)
        } else {
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

          setError(false);
          setName("");
          setEditMode(false);
        }
      })
  };

  const handleDelete = (event) => {
    event.preventDefault()

    fetch(`/api/${route}/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(res => {
        if (res.errorMessage) {
          setError(res.errorMessage)
        } else {
          setData(prevData => {
            const temp = prevData.filter(item => item.id !== id)
            setName('')
            setEditMode(false)
            return temp
          })
        }
      })
  };

  const handleDiscardChanges = () => {
    setId("")
    setName("")
    setEditMode(false)
    setError(null)
  }

  return (
    <div className="col-12 col-sm-6 mt-4">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit} >
        {error && <div className="alert alert-danger ">{error}</div>}
        <label className="form-label">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="form-control"
        />
        <div className="d-flex justify-content-between">
          <button
            className={`btn ${editMode ? 'btn-warning' : 'btn-success'}  mt-2`}
            type="submit"
          >
            Guardar
          </button>
          {editMode && <>
            <button
              className="btn btn-secondary mt-2"
              onClick={handleDiscardChanges}
            >
              Descartar
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger mt-2"
            >
              Eliminar
            </button>
          </>}
        </div>
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
                      setError(null);
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