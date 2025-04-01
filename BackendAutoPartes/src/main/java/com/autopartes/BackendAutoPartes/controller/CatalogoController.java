package com.autopartes.BackendAutoPartes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CatalogoController {

    @GetMapping("/Catalogo")
    public String catalogoPage() {
        return "Catalogo"; // nombre del archivo .html sin extensión
    }
}