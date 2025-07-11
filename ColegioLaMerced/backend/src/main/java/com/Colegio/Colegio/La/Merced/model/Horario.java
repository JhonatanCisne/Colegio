package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne; // Cambiado de OneToOne a ManyToOne
import jakarta.persistence.Table;

@Entity
@Table(name = "Horario")
public class Horario{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Horario")
    private Integer idHorario;

    @Column(name = "hora", nullable = false, length = 20)
    private String hora;

    @Column(name = "dia", nullable = false, length = 20)
    private String dia;

    @ManyToOne
    @JoinColumn(name = "ID_Seccion", referencedColumnName = "ID_Seccion", nullable = false)
    private Seccion seccion;

    @ManyToOne
    @JoinColumn(name = "ID_Profesor", referencedColumnName = "ID_Profesor", nullable = true)
    private Profesor profesor;

    public Horario() {
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

    public Seccion getSeccion() {
        return seccion;
    }

    public void setSeccion(Seccion seccion) {
        this.seccion = seccion;
    }

    public Profesor getProfesor() {
        return profesor;
    }

    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    @Override
    public String toString() {
        return "Horario{" +
                "idHorario=" + idHorario +
                ", hora='" + hora + '\'' +
                ", dia='" + dia + '\'' +
                ", seccion=" + (seccion != null ? seccion.getIdSeccion() : "null") + // Mostrar solo ID para evitar ciclos
                ", profesor=" + (profesor != null ? profesor.getIdProfesor() : "null") + // Mostrar solo ID
                '}';
    }
}