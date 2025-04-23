package com.university.crud_basic.config;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class RateLimitConfig implements WebMvcConfigurer {

    @Bean
    public DataOperationsLimitInterceptor rateLimitInterceptor() {
        return new DataOperationsLimitInterceptor(5, 60); // 10 operaciones de escritura por minuto
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitInterceptor())
                .addPathPatterns("/api/**"); // Aplicar a todas las rutas API
    }

    public static class DataOperationsLimitInterceptor implements HandlerInterceptor {
        private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
        private final int maxOperations;
        private final int timeWindowInSeconds;

        public DataOperationsLimitInterceptor(int maxOperations, int timeWindowInSeconds) {
            this.maxOperations = maxOperations;
            this.timeWindowInSeconds = timeWindowInSeconds;
        }

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            // Solo limitar operaciones POST, PUT y DELETE (escritura de datos)
            String method = request.getMethod();
            if ("GET".equals(method)) {
                return true; // No limitar operaciones GET (lectura)
            }
            
            // A partir de aquí, solo procesamos métodos POST, PUT y DELETE
            String clientIP = getClientIP(request);
            RequestCounter counter = requestCounts.computeIfAbsent(clientIP, 
                    k -> new RequestCounter(System.currentTimeMillis()));

            if (counter.isExpired(timeWindowInSeconds)) {
                counter.reset(System.currentTimeMillis());
            }

            if (counter.getCount() >= maxOperations) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Has superado el límite de operaciones de datos. Por favor, intenta más tarde.\"}");
                return false;
            }

            counter.increment();
            return true;
        }

        private String getClientIP(HttpServletRequest request) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0];
            }
            return request.getRemoteAddr();
        }

        private static class RequestCounter {
            private int count;
            private long timestamp;

            public RequestCounter(long timestamp) {
                this.count = 0;
                this.timestamp = timestamp;
            }

            public synchronized void increment() {
                count++;
            }

            public synchronized int getCount() {
                return count;
            }

            public synchronized boolean isExpired(int timeWindowInSeconds) {
                return System.currentTimeMillis() - timestamp > TimeUnit.SECONDS.toMillis(timeWindowInSeconds);
            }

            public synchronized void reset(long timestamp) {
                this.count = 0;
                this.timestamp = timestamp;
            }
        }
    }
}