package com.Colegio.Colegio.La.Merced.dto;

public class LoginRequest {
    private String dni;
    private String password;

    public LoginRequest() {
        // Constructor vacío necesario para que Spring pueda instanciar el objeto
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
