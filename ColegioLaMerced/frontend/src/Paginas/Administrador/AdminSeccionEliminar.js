import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminSeccionEliminar.css";

const AdminSeccionEliminar = () => {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [selectedSeccionId, setSelectedSeccionId] = useState("");
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  const fetchSecciones = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/secciones");
      setSecciones(response.data || []);
      console.log("Secciones cargadas:", response.data);
    } catch (err) {
      setMensaje({ type: "error", text: "Error al cargar la lista de secciones." });
      console.error("Error fetching sections:", err.response ? err.response.data : err.message);
    }
  }, []);

  useEffect(() => {
    fetchSecciones();
  }, [fetchSecciones]);

  const handleSeccionSelectChange = (e) => {
    setSelectedSeccionId(e.target.value);
    setMensaje({ type: "", text: "" });
  };

  const handleDeleteSeccion = async () => {
    setMensaje({ type: "", text: "" });

    if (!selectedSeccionId) {
      setMensaje({ type: "error", text: "Por favor, seleccione una sección para eliminar." });
      return;
    }

    if (!window.confirm("¿Está seguro de que desea eliminar esta sección y TODOS sus cursos, horarios, notas de alumnos, ANUNCIOS y ASISTENCIAS asociados? Esta acción es irreversible.")) {
      return;
    }

    try {
      console.log(`--- INICIANDO ELIMINACIÓN EN CASCADA PARA SECCIÓN ID: ${selectedSeccionId} ---`);

      // 1. Obtener todos los datos necesarios al inicio
      const [
        seccionCursosRes,
        allHorariosRes,
        allCursosUnicosRes,
        allAnunciosRes,
        allAsistenciasRes
      ] = await Promise.all([
        axios.get(`http://localhost:8080/api/seccioncursos/porSeccion/${selectedSeccionId}`),
        axios.get("http://localhost:8080/api/horarios"),
        axios.get("http://localhost:8080/api/cursosunicos"),
        axios.get("http://localhost:8080/api/anuncios"),
        axios.get("http://localhost:8080/api/asistencias")
      ]);

      const seccionCursosAsociados = seccionCursosRes.data || [];
      const allHorarios = allHorariosRes.data || [];
      const allCursosUnicos = allCursosUnicosRes.data || [];
      const allAnuncios = allAnunciosRes.data || [];
      const allAsistencias = allAsistenciasRes.data || [];

      console.log("Datos brutos obtenidos:");
      console.log("  SeccionCursos:", seccionCursosAsociados.map(sc => sc.idSeccionCurso));
      console.log("  Horarios (todos):", allHorarios.map(h => ({ id: h.idHorario, seccionId: h.seccion?.idSeccion })));
      console.log("  CursosUnicos (todos):", allCursosUnicos.map(cu => cu.idCursoUnico));
      console.log("  Anuncios (todos):", allAnuncios.map(a => a.idAnuncio));
      console.log("  Asistencias (todas):", allAsistencias.map(a => a.idAsistencia));

      const horariosToDeleteIds = new Set(); // Usamos un Set para IDs únicos de horarios

      // 2. Identificar y añadir todos los IDs de horarios directamente vinculados a esta sección
      // Esto captura horarios que podrían no estar vinculados a un SeccionCurso, pero sí a la Sección.
      allHorarios.forEach(h => {
        if (h.seccion && h.seccion.idSeccion === parseInt(selectedSeccionId)) {
          horariosToDeleteIds.add(h.idHorario);
          console.log(`  Horario ${h.idHorario} (directo) añadido al set.`);
        }
      });
      console.log("IDs de horarios directamente asociados a la sección (inicial):", Array.from(horariosToDeleteIds));

      // 3. Iterar sobre cada SeccionCurso asociado a la sección para eliminar sus dependencias
      console.log(`Procesando ${seccionCursosAsociados.length} SeccionCursos asociados...`);
      for (const sc of seccionCursosAsociados) {
        console.log(`  --- Procesando SeccionCurso ID: ${sc.idSeccionCurso} ---`);

        // A. Eliminar Asistencias asociadas a los CursoUnico de este SeccionCurso
        const cursosUnicosParaEliminar = allCursosUnicos.filter(cu =>
          (cu.seccionCurso && cu.seccionCurso.idSeccionCurso === sc.idSeccionCurso) ||
          (cu.idSeccionCurso === sc.idSeccionCurso) // Para DTOs que envían el ID directo
        );
        console.log(`    CursosUnicos a eliminar para SC ${sc.idSeccionCurso}:`, cursosUnicosParaEliminar.map(cu => cu.idCursoUnico));

        for (const cu of cursosUnicosParaEliminar) {
          const asistenciasParaEliminar = allAsistencias.filter(asist =>
            (asist.cursoUnico && asist.cursoUnico.idCursoUnico === cu.idCursoUnico) ||
            (asist.idCursoUnico === cu.idCursoUnico) // Para DTOs que envían el ID directo
          );
          console.log(`      Asistencias a eliminar para CU ${cu.idCursoUnico}:`, asistenciasParaEliminar.map(a => a.idAsistencia));

          for (const asist of asistenciasParaEliminar) {
            try {
              await axios.delete(`http://localhost:8080/api/asistencias/${asist.idAsistencia}`);
              console.log(`      Asistencia ${asist.idAsistencia} eliminada.`);
            } catch (deleteErr) {
              console.warn(`      Advertencia: No se pudo eliminar la asistencia ${asist.idAsistencia}.`, deleteErr.message);
            }
          }
          // Luego eliminar el CursoUnico
          try {
            await axios.delete(`http://localhost:8080/api/cursosunicos/${cu.idCursoUnico}`);
            console.log(`    CursoUnico ${cu.idCursoUnico} eliminado.`);
          } catch (deleteErr) {
            console.warn(`    Advertencia: No se pudo eliminar CursoUnico ${cu.idCursoUnico}.`, deleteErr.message);
          }
        }

        // B. Eliminar Anuncios asociados a este SeccionCurso
        const anunciosParaEliminar = allAnuncios.filter(an =>
          (an.seccionCurso && an.seccionCurso.idSeccionCurso === sc.idSeccionCurso) ||
          (an.idSeccionCurso === sc.idSeccionCurso) // Para DTOs que envían el ID directo
        );
        console.log(`    Anuncios a eliminar para SC ${sc.idSeccionCurso}:`, anunciosParaEliminar.map(a => a.idAnuncio));
        for (const anuncio of anunciosParaEliminar) {
          try {
            await axios.delete(`http://localhost:8080/api/anuncios/${anuncio.idAnuncio}`);
            console.log(`    Anuncio ${anuncio.idAnuncio} eliminado.`);
          } catch (deleteErr) {
            console.warn(`    Advertencia: No se pudo eliminar el anuncio ${anuncio.idAnuncio}.`, deleteErr.message);
          }
        }
        
        // C. Añadir el ID del horario asociado a este SeccionCurso al conjunto de IDs a eliminar
        // Esto asegura que los horarios vinculados a SeccionCurso también se eliminen.
        if (sc.horario && sc.horario.idHorario) {
          horariosToDeleteIds.add(sc.horario.idHorario);
          console.log(`    Horario ID ${sc.horario.idHorario} (de SeccionCurso) añadido al set.`);
        }

        // D. Eliminar el SeccionCurso
        console.log(`  Intentando eliminar SeccionCurso ID: ${sc.idSeccionCurso}`);
        try {
          await axios.delete(`http://localhost:8080/api/seccioncursos/${sc.idSeccionCurso}`);
          console.log(`  SeccionCurso ${sc.idSeccionCurso} eliminado exitosamente.`);
        } catch (deleteErr) {
          console.error(`  Error crítico al eliminar SeccionCurso ${sc.idSeccionCurso}:`, deleteErr);
          setMensaje({ type: "error", text: `Error crítico al desasignar el curso. Detalles: ${axios.isAxiosError(deleteErr) ? (deleteErr.response?.data?.message || JSON.stringify(deleteErr.response?.data)) : deleteErr.message}` });
          return; // Detener la ejecución si falla la eliminación de SeccionCurso
        }
      }

      // 4. Eliminar todos los Horarios recopilados de forma única
      // Este paso es CRÍTICO y se ejecuta después de que todos los SeccionCurso (y sus dependencias)
      // hayan sido eliminados, pero antes de eliminar la Sección.
      console.log("--- Eliminando todos los horarios recopilados (final):", Array.from(horariosToDeleteIds), "---");
      for (const horarioId of horariosToDeleteIds) {
          try {
              await axios.delete(`http://localhost:8080/api/horarios/${horarioId}`);
              console.log(`Horario ${horarioId} eliminado.`);
          } catch (deleteErr) {
              console.warn(`Advertencia: No se pudo eliminar el horario ${horarioId}.`, deleteErr.message);
          }
      }

      // 5. Finalmente, eliminar la Sección
      console.log(`--- Intentando eliminar Sección ID: ${selectedSeccionId} ---`);
      await axios.delete(`http://localhost:8080/api/secciones/${selectedSeccionId}`);
      console.log(`Sección ${selectedSeccionId} eliminada exitosamente.`);

      setMensaje({ type: "success", text: "Sección y todos sus datos asociados eliminados exitosamente." });
      setSelectedSeccionId("");
      fetchSecciones(); // Recargar la lista de secciones
    } catch (err) {
      let errorMessage = "Error al eliminar la sección y sus datos asociados. ";
      if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 404) {
              errorMessage = "Recurso no encontrado. Verifique que la sección o sus elementos existan.";
          } else {
              errorMessage += `Detalles: ${err.response.data.message || JSON.stringify(err.response.data)}`;
          }
      } else {
        errorMessage += err.message;
      }
      setMensaje({ type: "error", text: errorMessage });
      console.error("Error en eliminación en cascada (general catch):", err);
    }
  };

  return (
    <div className="contenedor-principal">
      <aside className="sidebar">
        <h2>Panel</h2>
        <ul>
          <li onClick={() => navigate("/AdminAlumnos")}>Alumnos</li>
          <li className="parent-menu-item">
            Profesores
            <ul>
              <li onClick={() => navigate("/AdminProfesores")}>Crear Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresVer")}>Ver Profesores</li>
              <li onClick={() => navigate("/AdminProfesoresModificar")}>Modificar Profesor</li>
              <li onClick={() => navigate("/AdminProfesoresEliminar")}>Eliminar Profesor</li>
            </ul>
          </li>
          <li className="parent-menu-item">
            Secciones
            <ul>
              <li onClick={() => navigate("/AdminSeccionesAgregar")}>Crear Sección</li>
              <li onClick={() => navigate("/AdminSeccionesModificar")}>Modificar Sección</li>
              <li className="activo" onClick={() => navigate("/AdminSeccionEliminar")}>Eliminar Sección</li>
            </ul>
          </li>
          <li className="cerrar-sesion" onClick={() => { localStorage.clear(); navigate("/"); }}>Cerrar sesión</li>
        </ul>
      </aside>

      <div className="contenido-principal">
        <main className="contenido-eliminar-seccion">
          <h1>Eliminar Sección</h1>
          {mensaje.text && (
            <div className={`mensaje ${mensaje.type === "success" ? "mensaje-exito" : "mensaje-error"}`}>
              {mensaje.text}
            </div>
          )}

          <div className="grupo">
            <label htmlFor="selectSeccion">Seleccionar Sección a Eliminar</label>
            <select
              id="selectSeccion"
              value={selectedSeccionId}
              onChange={handleSeccionSelectChange}
            >
              <option value="">-- Seleccione una Sección --</option>
              {secciones.map((sec) => (
                <option key={sec.idSeccion} value={sec.idSeccion}>
                  Grado: {sec.grado} - Nombre: {sec.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedSeccionId && (
            <section className="delete-action">
              <button
                onClick={handleDeleteSeccion}
                className="btn-eliminar"
              >
                Eliminar Sección Seleccionada (y sus cursos/horarios/notas/anuncios/asistencias)
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSeccionEliminar;