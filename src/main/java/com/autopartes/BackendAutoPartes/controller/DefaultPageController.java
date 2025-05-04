package com.autopartes.BackendAutoPartes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DefaultPageController {

    @GetMapping("/")
    public String redirectToDefaultPage() {
        return "redirect:/InicioSesionCliente.html";
    }
}
