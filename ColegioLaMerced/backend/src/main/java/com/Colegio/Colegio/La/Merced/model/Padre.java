package com.Colegio.Colegio.La.Merced.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Padre")
public class Padre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Padre")
    private Integer idPrade;

    @Column(name = "Nombre", nullable = false, length = 50)
    private String  nombre;

    @Column(name = "Apellido", nullable = false, length = 50)
    private String  apellido;

    @Column(name = "Telefono", nullable = false, length = 12)
    private String  telefono;

    @Column(name = "DNI", nullable = false, length = 12)
    private String  dni;    

    @Column(name = "Correo", nullable = false, length = 120)
    private String  correo;

    public Integer getIdPrade() {
        return idPrade;
    }

    public void setIdPrade(Integer idPrade) {
        this.idPrade = idPrade;
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    @Override
    public String toString() {
        return "Padre{" +
                "idPrade=" + idPrade +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", telefono='" + telefono + '\'' +
                ", dni='" + dni + '\'' +
                ", correo='" + correo + '\'' +
                '}';
    }
}
