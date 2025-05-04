package com.autopartes.BackendAutoPartes.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/mock-payments")
@CrossOrigin(origins = "*") // Permite solicitudes desde cualquier origen (útil para el frontend)
public class MockPaymentController {

    @PostMapping("/create")
    public Map<String, String> createPayment(@RequestBody PaymentRequest paymentRequest) {
        Map<String, String> response = new HashMap<>();
        response.put("paymentId", UUID.randomUUID().toString());
        response.put("status", "approved");
        response.put("amount", paymentRequest.getAmount().toString());
        response.put("email", paymentRequest.getEmail());
        response.put("message", "Pago simulado exitoso");
        return response;
    }

    @GetMapping("/status/{paymentId}")
    public Map<String, String> getPaymentStatus(@PathVariable String paymentId) {
        Map<String, String> response = new HashMap<>();
        response.put("paymentId", paymentId);
        response.put("status", "approved");
        response.put("message", "El pago fue aprobado");
        return response;
    }

    public static class PaymentRequest {
        private Double amount;
        private String email;

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}