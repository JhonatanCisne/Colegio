package com.Colegio.Colegio.La.Merced.dto;

public class HorarioDTO {
    private Integer idHorario;
    private String hora;
    private String dia;
    private Integer idSeccion;  // ID de la entidad Seccion
    private Integer idProfesor; // ID de la entidad Profesor

    public HorarioDTO() {
    }

    public HorarioDTO(Integer idHorario, String hora, String dia, Integer idSeccion, Integer idProfesor) {
        this.idHorario = idHorario;
        this.hora = hora;
        this.dia = dia;
        this.idSeccion = idSeccion;
        this.idProfesor = idProfesor;
    }

    public Integer getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Integer idHorario) {
        this.idHorario = idHorario;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public Integer getIdSeccion() {
        return idSeccion;
    }

    public void setIdSeccion(Integer idSeccion) {
        this.idSeccion = idSeccion;
    }

    public Integer getIdProfesor() {
        return idProfesor;
    }

    public void setIdProfesor(Integer idProfesor) {
        this.idProfesor = idProfesor;
    }
}