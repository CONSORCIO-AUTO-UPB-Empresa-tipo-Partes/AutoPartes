package com.autopartes.BackendAutoPartes.model.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String email;
    private String password;
    private Integer usertypeId;
    private String iddocument;
    private String personname;
    private String phonenumber;
    private String typedocument;
    private String personaddress;
    private String persontype;
}
