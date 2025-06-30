package com.Colegio.Colegio.La.Merced.dto; // Asegúrate de que el paquete sea el correcto

public class AnuncioDTO {

    private Integer idAnuncio;
    private String nombreProfesor;
    private String contenido;
    private Integer idSeccionCurso; // Usamos el ID para simplificar la comunicación

    public AnuncioDTO() {
    }

    public AnuncioDTO(String nombreProfesor, String contenido, Integer idSeccionCurso) {
        this.nombreProfesor = nombreProfesor;
        this.contenido = contenido;
        this.idSeccionCurso = idSeccionCurso;
    }

    public AnuncioDTO(Integer idAnuncio, String nombreProfesor, String contenido, Integer idSeccionCurso) {
        this.idAnuncio = idAnuncio;
        this.nombreProfesor = nombreProfesor;
        this.contenido = contenido;
        this.idSeccionCurso = idSeccionCurso;
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

    public Integer getIdSeccionCurso() {
        return idSeccionCurso;
    }

    public void setIdSeccionCurso(Integer idSeccionCurso) {
        this.idSeccionCurso = idSeccionCurso;
    }
}