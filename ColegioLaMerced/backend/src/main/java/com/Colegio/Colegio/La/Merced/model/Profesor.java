package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Profesor")
public class Profesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Profesor")
    private Integer idProfesor;

    @Column(name = "DNI", nullable = false, length = 12, unique = true)
    private String dni;

    @Column(name = "Nombre", nullable = false, length = 52)
    private String nombre;

    @Column(name = "Apellido", nullable = false, length = 50)
    private String apellido;

    @Column(name = "Estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "Contrasena", nullable = false)
    private String contrasena;

    public Integer getIdProfesor() {
        return idProfesor;
    }
    public void setIdProfesor(Integer idProfesor) {
        this.idProfesor = idProfesor;
    }

    public String getDni() {
        return dni;
    }
    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEstado() {
        return estado;
    }
    public void setEstado(String especialidad) {
        this.estado = especialidad;
    }

    public String getContrasena() {
        return contrasena;
    }
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
