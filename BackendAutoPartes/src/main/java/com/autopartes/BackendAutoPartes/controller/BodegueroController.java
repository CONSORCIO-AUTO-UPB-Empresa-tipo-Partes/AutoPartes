package com.autopartes.BackendAutoPartes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BodegueroController {

    @GetMapping("/Bodeguero")
    public String bodegueroPage() {
        return "Bodeguero"; // nombre del archivo .html sin extensión
    }
}
