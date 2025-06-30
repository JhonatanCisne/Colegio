package com.Colegio.Colegio.La.Merced.repository; // Asegúrate de que el paquete sea el correcto

import com.Colegio.Colegio.La.Merced.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, Integer> {
    // Puedes añadir métodos personalizados aquí si los necesitas, por ejemplo:
    List<Anuncio> findBySeccionCursoIdSeccionCurso(Integer idSeccionCurso);
}