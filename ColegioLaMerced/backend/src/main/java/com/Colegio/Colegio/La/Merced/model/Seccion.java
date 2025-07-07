package com.Colegio.Colegio.La.Merced.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Seccion")
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Seccion")
    private Integer idSeccion;

    @Column(name = "Grado", nullable = false, length=30)
    private String grado;

    @Column(name = "Nombre", nullable = false, length=4)
    private String nombre;

    @OneToMany(mappedBy = "seccion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Horario> horarios = new ArrayList<>();

    @OneToMany(mappedBy = "seccion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SeccionCurso> seccionCursos = new ArrayList<>();

    // Se elimina la relación directa con Alumno ya que se accede a través de SeccionCurso -> CursoUnico
    // @OneToMany(mappedBy = "seccion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    // private List<Alumno> alumnos = new ArrayList<>();


    public Seccion() {}

    public Seccion(String grado, String nombre) {
        this.grado = grado;
        this.nombre = nombre;
    }

    public Integer getIdSeccion() {
        return idSeccion;
    }

    public void setIdSeccion(Integer idSeccion) {
        this.idSeccion = idSeccion;
    }

    public String getGrado() {
        return grado;
    }

    public void setGrado(String grado) {
        this.grado = grado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<Horario> getHorarios() {
        return horarios;
    }

    public void setHorarios(List<Horario> horarios) {
        this.horarios = horarios;
    }

    public List<SeccionCurso> getSeccionCursos() {
        return seccionCursos;
    }

    public void setSeccionCursos(List<SeccionCurso> seccionCursos) {
        this.seccionCursos = seccionCursos;
    }

    // Se eliminan los getters/setters y métodos de conveniencia para Alumno
    // public List<Alumno> getAlumnos() {
    //     return alumnos;
    // }

    // public void setAlumnos(List<Alumno> alumnos) {
    //     this.alumnos = alumnos;
    // }

    public void addHorario(Horario horario) {
        this.horarios.add(horario);
        horario.setSeccion(this);
    }

    public void removeHorario(Horario horario) {
        this.horarios.remove(horario);
        horario.setSeccion(null);
    }

    public void addSeccionCurso(SeccionCurso seccionCurso) {
        this.seccionCursos.add(seccionCurso);
        seccionCurso.setSeccion(this);
    }

    public void removeSeccionCurso(SeccionCurso seccionCurso) {
        this.seccionCursos.remove(seccionCurso);
        seccionCurso.setSeccion(null);
    }

}
