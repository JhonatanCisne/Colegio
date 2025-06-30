package com.Colegio.Colegio.La.Merced.controller; // Asegúrate de que el paquete sea el correcto

import com.Colegio.Colegio.La.Merced.dto.AnuncioDTO;
import com.Colegio.Colegio.La.Merced.service.AnuncioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios") // Define la ruta base para todos los endpoints de Anuncios
@CrossOrigin(origins = "http://localhost:3000") // Permite peticiones desde tu frontend React
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    @GetMapping
    public ResponseEntity<List<AnuncioDTO>> getAllAnuncios() {
        List<AnuncioDTO> anuncios = anuncioService.getAllAnuncios();
        return new ResponseEntity<>(anuncios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnuncioDTO> getAnuncioById(@PathVariable Integer id) {
        return anuncioService.getAnuncioById(id)
                .map(anuncioDTO -> new ResponseEntity<>(anuncioDTO, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint para obtener anuncios por ID de SeccionCurso
    @GetMapping("/bySeccionCurso/{idSeccionCurso}")
    public ResponseEntity<List<AnuncioDTO>> getAnunciosBySeccionCurso(@PathVariable Integer idSeccionCurso) {
        List<AnuncioDTO> anuncios = anuncioService.getAnunciosBySeccionCursoId(idSeccionCurso);
        if (anuncios.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content si no hay anuncios
        }
        return new ResponseEntity<>(anuncios, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AnuncioDTO> createAnuncio(@RequestBody AnuncioDTO anuncioDTO) {
        try {
            AnuncioDTO createdAnuncio = anuncioService.createAnuncio(anuncioDTO);
            return new ResponseEntity<>(createdAnuncio, HttpStatus.CREATED); // 201 Created
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request si la SeccionCurso no existe
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnuncioDTO> updateAnuncio(@PathVariable Integer id, @RequestBody AnuncioDTO anuncioDTO) {
        try {
            return anuncioService.updateAnuncio(id, anuncioDTO)
                    .map(updatedAnuncio -> new ResponseEntity<>(updatedAnuncio, HttpStatus.OK)) // 200 OK
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND)); // 404 Not Found si el anuncio no existe
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request si la SeccionCurso no existe
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnuncio(@PathVariable Integer id) {
        if (anuncioService.deleteAnuncio(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
    }
}