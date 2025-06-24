package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

}
