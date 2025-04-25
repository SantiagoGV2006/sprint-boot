package com.university.crud_basic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class corsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        //no permitida
        // permitir solicitudes desde todos los origenes
        // // config.addAllowedOrigin("*");
        // config.addAllowedOrigin("http://127.0.0.1:5500");
        config.addAllowedOrigin("http://127.0.0.1:5500");
        config.addAllowedOrigin("http://172.30.5.79:5500");
        config.addAllowedOrigin("http://172.30.7.93:5501");
        config.addAllowedOrigin("http://localhost:5501"); // o el que estés usando
        // config.addAllowedOrigin("http://172.30.7.20:5500");
        
        // config.addAllowedOrigin("n cantidad de servidores");

        // permitir solicitudes con estos metodos HTTP
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");

        // permitir el envio de ciertos encabezados en las solicitudes
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("Content-Type");
        // config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}