package com.autopartes.BackendAutoPartes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProvidersController {
    @GetMapping("/Providers")
    public String providersPage() {
        return "Providers"; // nombre del archivo .html sin extensión
    }
}