package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne; // ¡CAMBIO IMPORTANTE AQUÍ! De OneToOne a ManyToOne
import jakarta.persistence.Table;

@Entity
@Table(name = "Asistencia") // El nombre de la tabla en tu DB, mayúsculas/minúsculas según configuración
public class Asistencia{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Asistencia")
    private Integer idAsistencia;

    @Column(name = "Fecha", nullable = false, length=20)
    private String fecha; // Considera usar java.time.LocalDate

    @Column(name = "Estado", nullable = false, length=20)
    private String estado;

    // ----- LA CORRECCIÓN CLAVE -----
    // Una Asistencia pertenece a UN CursoUnico (ManyToOne).
    // Un CursoUnico puede tener MUCHAS Asistencias.
    @ManyToOne // ¡Esto es lo que cambia!
    @JoinColumn(name = "ID_Curso_Unico", referencedColumnName = "ID_Curso_Unico", nullable=false)
    private CursoUnico cursoUnico;

    // --- Métodos Getters y Setters ---

    public Integer getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(Integer idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    // Nota: El nombre del getter/setter para 'cursoUnico' debe reflejar la propiedad
    // No 'getIdCursoUnico()' sino 'getCursoUnico()' y 'setCursoUnico()'
    public CursoUnico getCursoUnico() {
        return cursoUnico;
    }

    public void setCursoUnico(CursoUnico cursoUnico) {
        this.cursoUnico = cursoUnico;
    }

    @Override
    public String toString() {
        return "Asistencia{" +
                "idAsistencia=" + idAsistencia +
                ", fecha='" + fecha + '\'' +
                ", estado='" + estado + '\'' +
                ", cursoUnicoId=" + (cursoUnico != null ? cursoUnico.getIdCursoUnico() : "null") + // Muestra el ID del cursoUnico
                '}';
    }
}