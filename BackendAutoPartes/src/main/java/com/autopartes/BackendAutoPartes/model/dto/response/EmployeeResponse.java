package com.autopartes.BackendAutoPartes.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeResponse {
    private String documentNumber;
    private String name;
    private String lastname;
    private String email;
    private String phone;
    private String address;
    private String documentType;
    private String position;
}