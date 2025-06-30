package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn; // Importar JoinColumn
import jakarta.persistence.ManyToOne;   // Importar ManyToOne
import jakarta.persistence.Table;

@Entity
@Table(name = "Anuncios")
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Anuncio")
    private Integer idAnuncio;

    @Column(name = "Nombre_Profesor", nullable = false)
    private String nombreProfesor;

    @Column(name = "Contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    // Relación ManyToOne con SeccionCurso
    // Un Anuncio pertenece a una única SeccionCurso
    @ManyToOne
    @JoinColumn(name = "ID_Seccion_Curso", referencedColumnName = "ID_Seccion_Curso", nullable = false)
    private SeccionCurso seccionCurso;

    public Anuncio() {
    }

    // Si usas este constructor, necesitarás pasar el objeto SeccionCurso completo
    public Anuncio(String nombreProfesor, String contenido, SeccionCurso seccionCurso) {
        this.nombreProfesor = nombreProfesor;
        this.contenido = contenido;
        this.seccionCurso = seccionCurso;
    }

    public Integer getIdAnuncio() {
        return idAnuncio;
    }

    public void setIdAnuncio(Integer idAnuncio) {
        this.idAnuncio = idAnuncio;
    }

    public String getNombreProfesor() {
        return nombreProfesor;
    }

    public void setNombreProfesor(String nombreProfesor) {
        this.nombreProfesor = nombreProfesor;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public SeccionCurso getSeccionCurso() {
        return seccionCurso;
    }

    public void setSeccionCurso(SeccionCurso seccionCurso) {
        this.seccionCurso = seccionCurso;
    }
}