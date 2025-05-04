package com.autopartes.BackendAutoPartes.model.dto.request;

import lombok.Data;

@Data
public class PersonRequest {
    private String iddocument;
    private String name;
    private String lastname;
    private String phone;
    private String typedocument;
    private String address;
    private String persontype;
    private String email;
    private String password;
    private String usertype;
}