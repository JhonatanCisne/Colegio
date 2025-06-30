package com.Colegio.Colegio.La.Merced.service; // Asegúrate de que el paquete sea el correcto

import com.Colegio.Colegio.La.Merced.dto.AnuncioDTO;
import com.Colegio.Colegio.La.Merced.model.Anuncio;
import com.Colegio.Colegio.La.Merced.model.SeccionCurso;
import com.Colegio.Colegio.La.Merced.repository.AnuncioRepository;
import com.Colegio.Colegio.La.Merced.repository.SeccionCursoRepository; // Necesitarás este repositorio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException; // Importa esta excepción

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnuncioService {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private SeccionCursoRepository seccionCursoRepository; // Necesario para buscar SeccionCurso

    // Método para mapear Entidad a DTO
    private AnuncioDTO convertToDto(Anuncio anuncio) {
        return new AnuncioDTO(
                anuncio.getIdAnuncio(),
                anuncio.getNombreProfesor(),
                anuncio.getContenido(),
                anuncio.getSeccionCurso() != null ? anuncio.getSeccionCurso().getIdSeccionCurso() : null
        );
    }

    // Método para mapear DTO a Entidad (para crear/actualizar)
    private Anuncio convertToEntity(AnuncioDTO anuncioDTO) {
        Anuncio anuncio = new Anuncio();
        if (anuncioDTO.getIdAnuncio() != null) {
            anuncio.setIdAnuncio(anuncioDTO.getIdAnuncio());
        }
        anuncio.setNombreProfesor(anuncioDTO.getNombreProfesor());
        anuncio.setContenido(anuncioDTO.getContenido());

        // Buscar y asignar la entidad SeccionCurso
        if (anuncioDTO.getIdSeccionCurso() != null) {
            SeccionCurso seccionCurso = seccionCursoRepository.findById(anuncioDTO.getIdSeccionCurso())
                    .orElseThrow(() -> new EntityNotFoundException("SeccionCurso con ID " + anuncioDTO.getIdSeccionCurso() + " no encontrada"));
            anuncio.setSeccionCurso(seccionCurso);
        }
        return anuncio;
    }

    public List<AnuncioDTO> getAllAnuncios() {
        return anuncioRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<AnuncioDTO> getAnuncioById(Integer id) {
        return anuncioRepository.findById(id)
                .map(this::convertToDto);
    }

    public AnuncioDTO createAnuncio(AnuncioDTO anuncioDTO) {
        Anuncio anuncio = convertToEntity(anuncioDTO);
        Anuncio savedAnuncio = anuncioRepository.save(anuncio);
        return convertToDto(savedAnuncio);
    }

    public Optional<AnuncioDTO> updateAnuncio(Integer id, AnuncioDTO anuncioDTO) {
        return anuncioRepository.findById(id)
                .map(existingAnuncio -> {
                    // Actualizar solo los campos que pueden cambiar
                    existingAnuncio.setNombreProfesor(anuncioDTO.getNombreProfesor());
                    existingAnuncio.setContenido(anuncioDTO.getContenido());

                    // Si el ID de SeccionCurso cambia, buscar y reasignar
                    if (anuncioDTO.getIdSeccionCurso() != null &&
                        (existingAnuncio.getSeccionCurso() == null ||
                         !existingAnuncio.getSeccionCurso().getIdSeccionCurso().equals(anuncioDTO.getIdSeccionCurso()))) {
                        SeccionCurso newSeccionCurso = seccionCursoRepository.findById(anuncioDTO.getIdSeccionCurso())
                                .orElseThrow(() -> new EntityNotFoundException("SeccionCurso con ID " + anuncioDTO.getIdSeccionCurso() + " no encontrada para actualizar anuncio."));
                        existingAnuncio.setSeccionCurso(newSeccionCurso);
                    } else if (anuncioDTO.getIdSeccionCurso() == null) {
                         // Opcional: si permites desasociar la seccionCurso (aunque tu modelo Anuncio tiene nullable=false)
                         // existingAnuncio.setSeccionCurso(null);
                    }


                    Anuncio updatedAnuncio = anuncioRepository.save(existingAnuncio);
                    return convertToDto(updatedAnuncio);
                });
    }

    public boolean deleteAnuncio(Integer id) {
        if (anuncioRepository.existsById(id)) {
            anuncioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Método para obtener anuncios por id de SeccionCurso (ejemplo de método personalizado)
    public List<AnuncioDTO> getAnunciosBySeccionCursoId(Integer idSeccionCurso) {
        return anuncioRepository.findBySeccionCursoIdSeccionCurso(idSeccionCurso).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}