package com.autopartes.BackendAutoPartes.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO class for user type requests.
 * Contains fields for user type name and description.
 */
@Data
public class UserTypeRequest {

    @NotBlank(message = "El nombre del tipo de usuario no puede estar vacío")
    @Size(max = 45, message = "El nombre no puede exceder 45 caracteres")
    private String usertypename;

    @Size(max = 150, message = "La descripción no puede exceder 150 caracteres")
    private String description;
}