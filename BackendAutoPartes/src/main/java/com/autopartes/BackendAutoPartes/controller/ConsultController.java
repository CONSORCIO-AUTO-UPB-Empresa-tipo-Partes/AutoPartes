package com.autopartes.BackendAutoPartes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConsultController {

    @GetMapping("/ConsultaProveedores")
    public String consultPage() {
        return "ConsultaProveedores"; // nombre del archivo HTML sin extensión
    }
}
