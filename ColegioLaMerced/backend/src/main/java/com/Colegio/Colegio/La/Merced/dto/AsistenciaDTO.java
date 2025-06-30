package com.Colegio.Colegio.La.Merced.dto;

public class AsistenciaDTO {
    private Integer idAsistencia;
    private String fecha;
    private String estado;
    private Integer idCursoUnico;

    public AsistenciaDTO() {
    }

    public AsistenciaDTO(Integer idAsistencia, String fecha, String estado, Integer idCursoUnico) {
        this.idAsistencia = idAsistencia;
        this.fecha = fecha;
        this.estado = estado;
        this.idCursoUnico = idCursoUnico;
    }

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

    public Integer getIdCursoUnico() {
        return idCursoUnico;
    }

    public void setIdCursoUnico(Integer idCursoUnico) {
        this.idCursoUnico = idCursoUnico;
    }
}