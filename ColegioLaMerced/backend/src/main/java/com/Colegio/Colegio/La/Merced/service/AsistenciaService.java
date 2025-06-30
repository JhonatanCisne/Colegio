package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.Colegio.Colegio.La.Merced.dto.AsistenciaDTO;
import com.Colegio.Colegio.La.Merced.model.Asistencia;
import com.Colegio.Colegio.La.Merced.model.CursoUnico;
import com.Colegio.Colegio.La.Merced.repository.AsistenciaRepository;
import com.Colegio.Colegio.La.Merced.repository.CursoUnicoRepository;

@Service
public class AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private CursoUnicoRepository cursoUnicoRepository;

    // --- Métodos de Conversión (DTO <-> Entity) ---

    private AsistenciaDTO convertToDto(Asistencia asistencia) {
        AsistenciaDTO dto = new AsistenciaDTO();
        dto.setIdAsistencia(asistencia.getIdAsistencia());
        dto.setFecha(asistencia.getFecha());
        dto.setEstado(asistencia.getEstado());
        // Accede al objeto CursoUnico y luego a su ID
        if (asistencia.getCursoUnico() != null) { // Era .getIdCursoUnico(), ahora es .getCursoUnico()
            dto.setIdCursoUnico(asistencia.getCursoUnico().getIdCursoUnico());
        }
        return dto;
    }

    private Asistencia convertToEntity(AsistenciaDTO dto) {
        Asistencia asistencia = new Asistencia();
        asistencia.setIdAsistencia(dto.getIdAsistencia());
        asistencia.setFecha(dto.getFecha());
        asistencia.setEstado(dto.getEstado());

        // Si el DTO tiene un ID de CursoUnico, búscalo en el repositorio
        if (dto.getIdCursoUnico() != null) {
            Optional<CursoUnico> cursoUnicoOptional = cursoUnicoRepository.findById(dto.getIdCursoUnico());
            // Si el CursoUnico existe, asígnalo al objeto Asistencia
            // Si no existe, es un problema; podrías lanzar una excepción o manejarlo de otra forma
            asistencia.setCursoUnico(cursoUnicoOptional.orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CursoUnico con ID " + dto.getIdCursoUnico() + " no encontrado")
            ));
        } else {
            // Manejar el caso donde no se proporciona un ID de CursoUnico en el DTO
            // Dependiendo de tu lógica, esto podría ser un error (si siempre es requerido)
            // o simplemente dejarlo nulo si la columna en DB lo permite (pero tu @JoinColumn dice nullable=false)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID de CursoUnico es requerido para crear/actualizar una Asistencia.");
        }
        return asistencia;
    }

    // --- Operaciones CRUD ---

    public List<AsistenciaDTO> getAllAsistencias() {
        return asistenciaRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<AsistenciaDTO> getAsistenciaById(Integer id) {
        return asistenciaRepository.findById(id)
                .map(this::convertToDto);
    }

    public AsistenciaDTO createAsistencia(AsistenciaDTO asistenciaDTO) {
        // Asegúrate de que no se intente crear con un ID existente (si es IDENTITY, la DB lo genera)
        asistenciaDTO.setIdAsistencia(null); // Opcional: Asegura que el ID sea nulo para una nueva creación
        Asistencia asistencia = convertToEntity(asistenciaDTO);
        Asistencia savedAsistencia = asistenciaRepository.save(asistencia);
        return convertToDto(savedAsistencia);
    }

    public Optional<AsistenciaDTO> updateAsistencia(Integer id, AsistenciaDTO asistenciaDTO) {
        return asistenciaRepository.findById(id).map(existingAsistencia -> {
            existingAsistencia.setFecha(asistenciaDTO.getFecha());
            existingAsistencia.setEstado(asistenciaDTO.getEstado());

            // Actualiza la relación con CursoUnico si se proporciona un nuevo ID en el DTO
            if (asistenciaDTO.getIdCursoUnico() != null) {
                Optional<CursoUnico> cursoUnicoOptional = cursoUnicoRepository.findById(asistenciaDTO.getIdCursoUnico());
                existingAsistencia.setCursoUnico(cursoUnicoOptional.orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "CursoUnico con ID " + asistenciaDTO.getIdCursoUnico() + " no encontrado para actualización")
                ));
            } else {
                // Si el ID de CursoUnico se envía como nulo en el DTO para una actualización
                // y la columna es nullable=false en la DB, esto sería un error.
                // Podrías lanzar una excepción o simplemente no actualizar la relación si no se envía.
                // Considerando nullable=false, lanzar un error es una buena práctica.
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID de CursoUnico no puede ser nulo para actualizar una Asistencia.");
            }

            Asistencia updatedAsistencia = asistenciaRepository.save(existingAsistencia);
            return convertToDto(updatedAsistencia);
        });
    }

    public boolean deleteAsistencia(Integer id) {
        if (asistenciaRepository.existsById(id)) {
            asistenciaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}