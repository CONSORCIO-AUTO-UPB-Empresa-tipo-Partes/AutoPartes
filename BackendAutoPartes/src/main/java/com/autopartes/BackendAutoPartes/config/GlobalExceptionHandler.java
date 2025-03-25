package com.autopartes.BackendAutoPartes.config;

import com.fasterxml.jackson.databind.exc.InvalidDefinitionException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().body("🧨 Error general: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
    }
}
