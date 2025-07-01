package com.Colegio.Colegio.La.Merced.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // ¡Verifica este import!
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity // ¡Verifica esta anotación!
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/alumno/login").permitAll()
                .requestMatchers("/api/alumnos/**").permitAll()
                .requestMatchers("/api/profesores/login").permitAll()    
                .requestMatchers("/api/profesores/**").permitAll()
                .requestMatchers("/api/cursosunicos/**").permitAll()
                .requestMatchers("/api/cursos/**").permitAll()
                .requestMatchers("/api/seccioncursos/**").permitAll()
                .requestMatchers("/api/asistencias/**").permitAll()
                .requestMatchers("/api/horarios/**").permitAll()
                .requestMatchers("/api/secciones/**").permitAll()
                .requestMatchers("/api/administradores/**").permitAll()
                .requestMatchers("/api/padres/**").permitAll()
                .requestMatchers("/api/anuncios/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}