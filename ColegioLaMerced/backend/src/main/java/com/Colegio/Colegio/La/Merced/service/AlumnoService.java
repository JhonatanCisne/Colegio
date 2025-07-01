package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.Colegio.Colegio.La.Merced.dto.AlumnoDTO;
import com.Colegio.Colegio.La.Merced.exception.DniAlreadyExistsException;
import com.Colegio.Colegio.La.Merced.model.Alumno;
import com.Colegio.Colegio.La.Merced.model.CursoUnico;
import com.Colegio.Colegio.La.Merced.model.Padre;
import com.Colegio.Colegio.La.Merced.repository.AlumnoRepository;
import com.Colegio.Colegio.La.Merced.repository.AsistenciaRepository;
import com.Colegio.Colegio.La.Merced.repository.CursoUnicoRepository;
import com.Colegio.Colegio.La.Merced.repository.PadreRepository;

import jakarta.persistence.EntityManager; // <--- NEW IMPORT

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private PadreRepository padreRepository;

    @Autowired
    private CursoUnicoRepository cursoUnicoRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private EntityManager entityManager; // <--- NEW INJECTION

    private AlumnoDTO convertToDto(Alumno alumno) {
        AlumnoDTO dto = new AlumnoDTO();
        dto.setIdAlumno(alumno.getIdAlumno());
        dto.setNombre(alumno.getNombre());
        dto.setApellido(alumno.getApellido());
        dto.setDni(alumno.getDni());
        dto.setCorreo(alumno.getCorreo());
        dto.setContrasena(alumno.getContrasena());
        if (alumno.getPadre() != null) {
            dto.setIdPadre(alumno.getPadre().getIdPadre());
        }
        return dto;
    }

    private Alumno convertToEntity(AlumnoDTO dto) {
        Alumno alumno = new Alumno();
        alumno.setIdAlumno(dto.getIdAlumno());
        alumno.setNombre(dto.getNombre());
        alumno.setApellido(dto.getApellido());
        alumno.setDni(dto.getDni());
        alumno.setCorreo(dto.getCorreo());
        alumno.setContrasena(dto.getContrasena());

        if (dto.getIdPadre() != null) {
            Optional<Padre> padreOptional = padreRepository.findById(dto.getIdPadre());
            padreOptional.ifPresent(alumno::setPadre);
        }
        return alumno;
    }

    public List<AlumnoDTO> getAllAlumnos() {
        return alumnoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<AlumnoDTO> getAlumnoById(Integer id) {
        return alumnoRepository.findById(id)
                .map(this::convertToDto);
    }

    public AlumnoDTO createAlumno(AlumnoDTO alumnoDTO) {
        Alumno alumno = convertToEntity(alumnoDTO);
        try {
            Alumno savedAlumno = alumnoRepository.save(alumno);
            return convertToDto(savedAlumno);
        } catch (DataIntegrityViolationException e) {
            throw new DniAlreadyExistsException("El DNI '" + alumno.getDni() + "' ya está registrado.", e);
        }
    }

    public Optional<AlumnoDTO> updateAlumno(Integer id, AlumnoDTO alumnoDTO) {
        return alumnoRepository.findById(id).map(existingAlumno -> {
            existingAlumno.setNombre(alumnoDTO.getNombre());
            existingAlumno.setApellido(alumnoDTO.getApellido());
            existingAlumno.setCorreo(alumnoDTO.getCorreo());
            existingAlumno.setContrasena(alumnoDTO.getContrasena());

            existingAlumno.setDni(alumnoDTO.getDni());

            if (alumnoDTO.getIdPadre() != null) {
                Optional<Padre> padreOptional = padreRepository.findById(alumnoDTO.getIdPadre());
                padreOptional.ifPresent(existingAlumno::setPadre);
            } else {
                // Si el idPadre viene como null en el DTO, puedes decidir si desasociarlo.
                // existingAlumno.setPadre(null);
            }

            try {
                Alumno updatedAlumno = alumnoRepository.save(existingAlumno);
                return convertToDto(updatedAlumno);
            } catch (DataIntegrityViolationException e) {
                throw new DniAlreadyExistsException("El DNI '" + alumnoDTO.getDni() + "' ya está registrado por otro alumno.", e);
            }
        });
    }

    public boolean deleteAlumno(Integer id) {
        if (alumnoRepository.existsById(id)) {
            alumnoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public void eliminarAlumnoPorDni(String dni) {
        Optional<Alumno> optionalAlumno = alumnoRepository.findByDni(dni);

        if (optionalAlumno.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Alumno con DNI " + dni + " no encontrado.");
        }

        Alumno alumno = optionalAlumno.get();
        Integer alumnoId = alumno.getIdAlumno();

        List<CursoUnico> cursosDelAlumno = cursoUnicoRepository.findByAlumnoIdAlumno(alumnoId);

        // Clear the persistence context after fetching entities but before direct DELETE queries
        // This ensures Hibernate doesn't hold references to entities that are about to be deleted directly.
        entityManager.flush(); // Ensure any pending changes are pushed to DB
        entityManager.clear(); // Detach all managed entities from the context

        // 2. Iterar sobre cada CursoUnico y ELIMINAR SUS ASISTENCIAS PRIMERO.
        // Even though we cleared the context, we still need the IDs from the 'cursosDelAlumno' list
        // which was fetched BEFORE clearing.
        for (CursoUnico cursoUnico : cursosDelAlumno) {
            // Eliminar todas las Asistencias relacionadas con el CursoUnico actual.
            asistenciaRepository.deleteByCursoUnicoId(cursoUnico.getIdCursoUnico());
        }

        // 3. Después de eliminar todas las Asistencias, ahora sí eliminar los CursoUnico asociados al alumno.
        cursoUnicoRepository.deleteCursoUnicoByAlumnoId(alumnoId);

        // 4. Finalmente, eliminar el alumno, una vez que todas sus dependencias han sido eliminadas.
        // It's good practice to fetch the Alumno again or ensure it's re-attached if needed,
        // especially after clearing the context.
        // However, for a simple delete by ID, often the initial 'alumno' object might still work
        // or a re-fetch is safer if you encounter issues.
        // For simplicity and given the error, a direct deleteById might be more robust here.
        alumnoRepository.deleteById(alumnoId); // Use deleteById with the ID you already have.
    }
}