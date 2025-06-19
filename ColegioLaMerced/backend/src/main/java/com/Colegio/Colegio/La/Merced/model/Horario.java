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
@Table(name = "Horario")
public class Horario{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Horario")
    private Integer idHorario;

    @Column(name = "hora", nullable = false, length=20)
    private String hora;

    @Column(name = "dia", nullable = false, length=20)
    private String dia;

    @OneToOne
    @JoinColumn(name = "ID_Seccion", referencedColumnName = "ID_Seccion", nullable=false)
    private Seccion seccion;

    @OneToOne
    @JoinColumn(name="ID_Profesor", referencedColumnName = "ID_Profesor", nullable=false)
    private Profesor profesor;

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

    public Seccion getIdSeccion() {
        return seccion;
    }

    public void setIdSeccion(Seccion seccion) {
        this.seccion = seccion;
    }

    public Profesor getIdProfesor() {
        return profesor;
    }

    public void setIdProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    @Override
    public String toString() {
        return "Horario{" +
                "idHorario=" + idHorario +
                ", hora='" + hora + '\'' +
                ", dia='" + dia + '\'' +
                ", idSeccion=" + seccion +
                ", idProfesor=" + profesor +
                '}';
    }

}

