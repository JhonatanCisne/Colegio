// src/main/java/com/Colegio/Colegio/La/Merced/exception/DniAlreadyExistsException.java
package com.Colegio.Colegio.La.Merced.exception;

public class DniAlreadyExistsException extends RuntimeException {

    public DniAlreadyExistsException(String message) {
        super(message);
    }

    public DniAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}