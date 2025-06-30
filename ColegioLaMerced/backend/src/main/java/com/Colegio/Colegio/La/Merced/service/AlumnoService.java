package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ¡Añadir esta importación!

import com.Colegio.Colegio.La.Merced.dto.AlumnoDTO;
import com.Colegio.Colegio.La.Merced.exception.DniAlreadyExistsException;
import com.Colegio.Colegio.La.Merced.model.Alumno;
import com.Colegio.Colegio.La.Merced.model.Padre;
import com.Colegio.Colegio.La.Merced.repository.AlumnoRepository;
import com.Colegio.Colegio.La.Merced.repository.PadreRepository;
import com.Colegio.Colegio.La.Merced.repository.CursoUnicoRepository; // ¡Añadir esta importación!


@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private PadreRepository padreRepository;

    @Autowired // ¡Añadir esta inyección de dependencia!
    private CursoUnicoRepository cursoUnicoRepository;

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

    // Método para eliminar un alumno por su ID (ya existente)
    public boolean deleteAlumno(Integer id) {
        if (alumnoRepository.existsById(id)) {
            alumnoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Elimina un alumno por su DNI, y previamente elimina todos sus registros asociados
     * en CursoUnico para mantener la integridad referencial.
     * @param dni El DNI del alumno a eliminar.
     * @throws RuntimeException si el alumno no es encontrado.
     */
    @Transactional // ¡Añadir esta anotación! Crucial para la atomicidad de la operación.
    public void eliminarAlumnoPorDni(String dni) {
        Optional<Alumno> optionalAlumno = alumnoRepository.findByDni(dni); // Necesitarás este método en AlumnoRepository

        if (optionalAlumno.isEmpty()) {
            throw new RuntimeException("Alumno con DNI " + dni + " no encontrado.");
        }

        Alumno alumno = optionalAlumno.get();
        Integer alumnoId = alumno.getIdAlumno(); 

        // PASO 1: Eliminar todos los registros de CursoUnico asociados a este alumno
        // Usa el método que agregaste a CursoUnicoRepository.
        // Por ejemplo, si usaste @Query("DELETE FROM CursoUnico cu WHERE cu.idAlumno = :idAlumno")
        cursoUnicoRepository.deleteCursoUnicoByAlumnoId(alumnoId);

        // Si optaste por el método derivado de Spring Data JPA:
        // cursoUnicoRepository.deleteByIdAlumno(alumnoId);

        // PASO 2: Ahora que las referencias han sido eliminadas, eliminar el alumno
        alumnoRepository.delete(alumno);
    }
}