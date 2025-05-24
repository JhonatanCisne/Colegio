import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Administrador/AdminProfesores.css";

const cargos = [
  "Profesor Titular",
  "Profesor Auxiliar",
  "Profesor Invitado",
];

const profesoresEjemplo = [
  {
    dni: "98765432",
    nombre: "Carlos",
    apellido: "Ramírez",
    fechaNacimiento: "1980-07-22",
    cargo: "Profesor Titular",
  },
  {
    dni: "23456789",
    nombre: "Lucía",
    apellido: "Fernández",
    fechaNacimiento: "1985-03-10",
    cargo: "Profesor Auxiliar",
  },
];

const AdminProfesores = () => {
  const navigate = useNavigate();

  const [seccionSidebar, setSeccionSidebar] = useState("Profesores");
  const [seccionBotones, setSeccionBotones] = useState("Añadir");
  const [profesor, setProfesor] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    cargo: "",
  });
  const [dniBuscar, setDniBuscar] = useState("");
  const [profesorEncontrado, setProfesorEncontrado] = useState(null);
  const [errorBuscar, setErrorBuscar] = useState("");
  const [listaProfesores, setListaProfesores] = useState(profesoresEjemplo);

  // Manejar inputs añadir/modificar
  const handleChange = (e) => {
    setProfesor({ ...profesor, [e.target.name]: e.target.value });
  };

  // Agregar profesor
  const handleAgregar = (e) => {
    e.preventDefault();
    setListaProfesores([...listaProfesores, profesor]);
    alert("Profesor agregado!");
    setProfesor({
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: "",
      cargo: "",
    });
  };

  // Buscar profesor por DNI para modificar
  const buscarProfesorPorDni = () => {
    const encontrado = listaProfesores.find((p) => p.dni === dniBuscar);
    if (encontrado) {
      setProfesorEncontrado(encontrado);
      setProfesor(encontrado);
      setErrorBuscar("");
    } else {
      setProfesorEncontrado(null);
      setErrorBuscar("Profesor no encontrado");
    }
  };

  // Modificar profesor
  const handleModificar = (e) => {
    e.preventDefault();
    if (!profesorEncontrado) return;
    setListaProfesores(
      listaProfesores.map((p) =>
        p.dni === profesor.dni ? { ...profesor } : p
      )
    );
    alert("Profesor modificado!");
    setProfesorEncontrado(null);
    setDniBuscar("");
    setProfesor({
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: "",
      cargo: "",
    });
  };

  // Eliminar profesor
  const handleEliminar = (e) => {
    e.preventDefault();
    const profesorExistente = listaProfesores.find((p) => p.dni === dniBuscar);
    if (!profesorExistente) {
      setErrorBuscar("Profesor no encontrado");
      return;
    }
    setListaProfesores(listaProfesores.filter((p) => p.dni !== dniBuscar));
    alert("Profesor eliminado!");
    setDniBuscar("");
    setErrorBuscar("");
  };

  return (
    <div className="contenedor-principal">
      <aside className="sidebar">
        <h2>Panel</h2>
        <ul>
          <li
            className={seccionSidebar === "Alumnos" ? "activo" : ""}
            onClick={() => {
              setSeccionSidebar("Alumnos");
              navigate("/AdminAlumnos");
            }}
          >
            Alumnos
          </li>
          <li
            className={seccionSidebar === "Profesores" ? "activo" : ""}
            onClick={() => {
              setSeccionSidebar("Profesores");
              setSeccionBotones("Añadir");
              setProfesorEncontrado(null);
              setDniBuscar("");
              setErrorBuscar("");
            }}
          >
            Profesores
          </li>
          <li
            className="cerrar-sesion"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Cerrar sesión
          </li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <div className="barra-botones">
          {["Añadir", "Modificar", "Eliminar", "Ver"].map((opcion) => (
            <button
              key={opcion}
              className={seccionBotones === opcion ? "btn-activo" : ""}
              onClick={() => {
                setSeccionBotones(opcion);
                setProfesorEncontrado(null);
                setDniBuscar("");
                setErrorBuscar("");
                setProfesor({
                  nombre: "",
                  apellido: "",
                  dni: "",
                  fechaNacimiento: "",
                  cargo: "",
                });
              }}
            >
              {opcion}
            </button>
          ))}
        </div>

        <main className="contenido-profesor">
          {seccionBotones === "Añadir" && (
            <>
              <h2>Registrar Nuevo Profesor</h2>
              <form onSubmit={handleAgregar}>
                <div className="grupo">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={profesor.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={profesor.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>DNI</label>
                  <input
                    type="text"
                    name="dni"
                    value={profesor.dni}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={profesor.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grupo">
                  <label>Cargo</label>
                  <select
                    name="cargo"
                    value={profesor.cargo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un cargo</option>
                    {cargos.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-registrar">
                  Registrar Profesor
                </button>
              </form>
            </>
          )}

          {seccionBotones === "Modificar" && (
            <>
              <h2>Modificar Profesor</h2>
              <div className="grupo buscar-dni">
                <label>Buscar por DNI</label>
                <input
                  type="text"
                  value={dniBuscar}
                  onChange={(e) => setDniBuscar(e.target.value)}
                  placeholder="Ingrese DNI"
                />
                <button
                  className="btn-buscar"
                  onClick={buscarProfesorPorDni}
                  disabled={!dniBuscar}
                >
                  Buscar
                </button>
                {errorBuscar && <p className="error">{errorBuscar}</p>}
              </div>

              {profesorEncontrado && (
                <form onSubmit={handleModificar}>
                  <div className="grupo">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={profesor.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={profesor.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label>DNI (no editable)</label>
                    <input type="text" name="dni" value={profesor.dni} readOnly />
                  </div>
                  <div className="grupo">
                    <label>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={profesor.fechaNacimiento}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grupo">
                    <label>Cargo</label>
                    <select
                      name="cargo"
                      value={profesor.cargo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un cargo</option>
                      {cargos.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-registrar">
                    Guardar Cambios
                  </button>
                </form>
              )}
            </>
          )}

          {seccionBotones === "Eliminar" && (
            <>
              <h2>Eliminar Profesor</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEliminar(e);
                }}
              >
                <div className="grupo">
                  <label>Ingrese DNI para eliminar</label>
                  <input
                    type="text"
                    value={dniBuscar}
                    onChange={(e) => setDniBuscar(e.target.value)}
                    placeholder="DNI"
                    required
                  />
                </div>
                {errorBuscar && <p className="error">{errorBuscar}</p>}
                <button type="submit" className="btn-eliminar">
                  Eliminar Profesor
                </button>
              </form>
            </>
          )}

          {seccionBotones === "Ver" && (
            <>
              <h2>Lista de Profesores</h2>
              <table className="tabla-profesores">
                <thead>
                  <tr>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Fecha Nac.</th>
                    <th>Cargo</th>
                  </tr>
                </thead>
                <tbody>
                  {listaProfesores.length > 0 ? (
                    listaProfesores.map((p) => (
                      <tr key={p.dni}>
                        <td>{p.dni}</td>
                        <td>{p.nombre}</td>
                        <td>{p.apellido}</td>
                        <td>{p.fechaNacimiento}</td>
                        <td>{p.cargo}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No hay profesores para mostrar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProfesores;
