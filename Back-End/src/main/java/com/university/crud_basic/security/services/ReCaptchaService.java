package com.university.crud_basic.security.services;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.annotation.JsonProperty;

@Service
public class ReCaptchaService {
    
    @Value("${recaptcha.secret}")
    private String recaptchaSecret;
    
    @Value("${recaptcha.verify-url}")
    private String recaptchaVerifyUrl;
    
    private final WebClient webClient;
    
    public ReCaptchaService() {
        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();
    }
    
    /**
     * Valida un token de reCAPTCHA con la API de Google.
     * 
     * @param token El token de reCAPTCHA a validar
     * @return true si el token es válido, false de lo contrario
     */
    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        
        try {
            Map<String, String> formData = new HashMap<>();
            formData.put("secret", recaptchaSecret);
            formData.put("response", token);
            
            RecaptchaResponse response = webClient.post()
                    .uri(URI.create(recaptchaVerifyUrl))
                    .body(BodyInserters.fromFormData("secret", recaptchaSecret)
                            .with("response", token))
                    .retrieve()
                    .bodyToMono(RecaptchaResponse.class)
                    .block();
            
            return response != null && response.isSuccess();
        } catch (Exception e) {
            // En caso de error, registrar y devolver false
            System.err.println("Error validando reCAPTCHA: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Clase para deserializar la respuesta de la API de reCAPTCHA
     */
    private static class RecaptchaResponse {
        private boolean success;
        private String hostname;
        
        @JsonProperty("challenge_ts")
        private String challengeTs;
        
        @JsonProperty("error-codes")
        private String[] errorCodes;
        
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
        
        public String getHostname() {
            return hostname;
        }
        
        public void setHostname(String hostname) {
            this.hostname = hostname;
        }
        
        public String getChallengeTs() {
            return challengeTs;
        }
        
        public void setChallengeTs(String challengeTs) {
            this.challengeTs = challengeTs;
        }
        
        public String[] getErrorCodes() {
            return errorCodes;
        }
        
        public void setErrorCodes(String[] errorCodes) {
            this.errorCodes = errorCodes;
        }
    }
}