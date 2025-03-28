package com.autopartes.BackendAutoPartes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BatchsController {
    @GetMapping("/Batch")
    public String batchPage() {
        return "Batch"; // nombre del archivo .html sin extensión
    }
}