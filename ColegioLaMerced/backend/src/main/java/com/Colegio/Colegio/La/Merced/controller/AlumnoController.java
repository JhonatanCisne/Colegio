package com.Colegio.Colegio.La.Merced.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Colegio.Colegio.La.Merced.dto.AlumnoDTO;
import com.Colegio.Colegio.La.Merced.service.AlumnoService;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin(origins = "http://localhost:3000") 
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @GetMapping
    public List<AlumnoDTO> listarAlumnos() {
        return alumnoService.listarAlumnos();
    }

    @GetMapping("/{dni}")
    public AlumnoDTO obtenerAlumno(@PathVariable String dni) {
        return alumnoService.buscarPorDni(dni);
    }

    @PostMapping
    public AlumnoDTO crearAlumno(@RequestBody AlumnoDTO alumnoDTO) {
        return alumnoService.crearAlumno(alumnoDTO);
    }

    @PutMapping("/{dni}")
    public AlumnoDTO actualizarAlumno(@PathVariable String dni, @RequestBody AlumnoDTO alumnoDTO) {
        return alumnoService.actualizarAlumno(dni, alumnoDTO);
    }

    @DeleteMapping("/{dni}")
    public void eliminarAlumno(@PathVariable String dni) {
        alumnoService.eliminarAlumno(dni);
    }
}
