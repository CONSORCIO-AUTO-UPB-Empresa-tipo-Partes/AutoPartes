package com.autopartes.BackendAutoPartes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private String redirect;
}
