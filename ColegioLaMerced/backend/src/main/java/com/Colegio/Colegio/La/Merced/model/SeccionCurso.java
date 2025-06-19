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
@Table(name = "Seccion_Curso")
public class SeccionCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Seccion_Curso")
    private Integer idSeccionCurso;

    @OneToOne
    @JoinColumn(name = "ID_Curso", referencedColumnName = "ID_Curso", nullable=false)
    private Integer idCurso;

    @OneToOne
    @JoinColumn(name="ID_Profesor", referencedColumnName = "ID_Profesor", nullable=false)
    private Integer idProfesor;

    @OneToOne
    @JoinColumn(name = "ID_Seccion", referencedColumnName = "ID_Seccion", nullable=false)
    private Integer idSeccion;

    public Integer getIdSeccionCurso(){
        return idSeccionCurso;
    }

    public void setIdSeccionCurso(Integer idSeccionCurso) {
        this.idSeccionCurso = idSeccionCurso;
    }

    public Integer getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Integer idCurso) {
        this.idCurso = idCurso;
    }

    public Integer getIdProfesor() {
        return idProfesor;
    }

    public void setIdProfesor(Integer idProfesor) {
        this.idProfesor = idProfesor;
    }

    public Integer getIdSeccion() {
        return idSeccion;
    }

    public void setIdSeccion(Integer idSeccion) {
        this.idSeccion = idSeccion;
    }

    @Override
    public String toString() {
        return "SeccionCurso{" +
                "idSeccionCurso=" + idSeccionCurso +
                ", idCurso=" + idCurso +
                ", idProfesor=" + idProfesor +
                ", idSeccion=" + idSeccion +
                '}';
    }

}
