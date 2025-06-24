package com.Colegio.Colegio.La.Merced.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Colegio.Colegio.La.Merced.dto.PadreDTO;
import com.Colegio.Colegio.La.Merced.model.Padre;
import com.Colegio.Colegio.La.Merced.repository.PadreRepository;

@Service
public class PadreService {

    @Autowired
    private PadreRepository padreRepository;

    private PadreDTO convertToDto(Padre padre) {
        PadreDTO dto = new PadreDTO();
        dto.setIdPadre(padre.getIdPadre());
        dto.setDni(padre.getDni());
        dto.setNombre(padre.getNombre());
        dto.setApellido(padre.getApellido());
        dto.setTelefono(padre.getTelefono());
        dto.setCorreo(padre.getCorreo());
        return dto;
    }

    private Padre convertToEntity(PadreDTO dto) {
        Padre padre = new Padre();
        padre.setIdPadre(dto.getIdPadre());
        padre.setDni(dto.getDni());
        padre.setNombre(dto.getNombre());
        padre.setApellido(dto.getApellido());
        padre.setTelefono(dto.getTelefono());
        padre.setCorreo(dto.getCorreo());
        return padre;
    }

    public List<PadreDTO> getAllPadres() {
        return padreRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<PadreDTO> getPadreById(Integer id) {
        return padreRepository.findById(id)
                .map(this::convertToDto);
    }

    public PadreDTO createPadre(PadreDTO padreDTO) {
        Padre padre = convertToEntity(padreDTO);
        Padre savedPadre = padreRepository.save(padre);
        return convertToDto(savedPadre);
    }

    public Optional<PadreDTO> updatePadre(Integer id, PadreDTO padreDTO) {
        return padreRepository.findById(id).map(existingPadre -> {
            existingPadre.setDni(padreDTO.getDni());
            existingPadre.setNombre(padreDTO.getNombre());
            existingPadre.setApellido(padreDTO.getApellido());
            existingPadre.setTelefono(padreDTO.getTelefono());
            existingPadre.setCorreo(padreDTO.getCorreo());
            Padre updatedPadre = padreRepository.save(existingPadre);
            return convertToDto(updatedPadre);
        });
    }

    public boolean deletePadre(Integer id) {
        if (padreRepository.existsById(id)) {
            padreRepository.deleteById(id);
            return true;
        }
        return false;
    }
}