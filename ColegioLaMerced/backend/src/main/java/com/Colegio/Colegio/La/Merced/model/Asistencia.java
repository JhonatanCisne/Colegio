package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Asistencia")
public class Asistencia{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Asistencia")
    private Integer idAsistencia;

    @Column(name = "Fecha", nullable = false, length=20)
    private String fecha;

    @Column(name = "Estado", nullable = false, length=20)
    private String estado;

    @OneToOne
    @JoinColumn(name = "ID_Curso_Unico", referencedColumnName = "ID_Curso_Unico", nullable=false)
    private CursoUnico cursoUnico;

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

    public CursoUnico getIdCursoUnico() {
        return cursoUnico;
    }

    public void setIdCursoUnico(CursoUnico cursoUnico) {
        this.cursoUnico = cursoUnico;
    }

    @Override
    public String toString() {
        return "Asistencia{" +
                "idAsistencia=" + idAsistencia +
                ", fecha='" + fecha + '\'' +
                ", estado='" + estado + '\'' +
                ", idCursoUnico=" + cursoUnico +
                '}';
    }
}