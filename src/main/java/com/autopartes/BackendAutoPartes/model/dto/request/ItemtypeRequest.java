package com.autopartes.BackendAutoPartes.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ItemtypeRequest {

    @NotBlank(message = "El nombre del item no puede estar vacío")
    @Size(max = 45, message = "El nombre no puede exceder 45 caracteres")
    private String itemname;

    private String imagepath;
}