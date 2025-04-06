package com.autopartes.BackendAutoPartes.config;

import com.fasterxml.jackson.databind.exc.InvalidDefinitionException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body("❌ Error de lectura del cuerpo: " + ex.getCause());
    }

    @ExceptionHandler(UnrecognizedPropertyException.class)
    public ResponseEntity<?> handleUnrecognizedProperty(UnrecognizedPropertyException ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body("❌ Propiedad no reconocida en JSON: " + ex.getPropertyName());
    }

    @ExceptionHandler(MismatchedInputException.class)
    public ResponseEntity<?> handleMismatch(MismatchedInputException ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body("❌ Tipo de dato incorrecto: " + ex.getMessage());
    }

    @ExceptionHandler(InvalidDefinitionException.class)
    public ResponseEntity<?> handleInvalidDefinition(InvalidDefinitionException ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body("❌ Definición inválida: " + ex.getMessage());
    }

    // New exception handlers for authentication and authorization

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("🔒 Acceso denegado: No tienes permisos suficientes para esta operación");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthentication(AuthenticationException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("🔑 Error de autenticación: Credenciales inválidas o sesión expirada");
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<?> handleExpiredJwt(ExpiredJwtException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("⏰ Token JWT expirado: La sesión ha caducado, por favor inicia sesión nuevamente");
    }

    @ExceptionHandler({MalformedJwtException.class, SignatureException.class})
    public ResponseEntity<?> handleInvalidJwt(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("🔏 Token JWT inválido: El formato del token es incorrecto o ha sido manipulado");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body("🧨 Error general: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
    }
}