package com.autopartes.BackendAutoPartes.model.dto.response;

import lombok.Data;

@Data
public class PersonResponse {
    private String iddocument;
    private String personname;
    private String phonenumber;
    private String typedocument;
    private String personaddress;
    private String persontype;
    private String email;
    private String usertype;
}