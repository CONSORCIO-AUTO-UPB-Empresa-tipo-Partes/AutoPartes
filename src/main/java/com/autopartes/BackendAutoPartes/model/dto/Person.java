package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "person", schema = "autopartes")
public class Person {

    @Id
    @Column(name = "iddocument", nullable = false, length = 15)
    private String iddocument;

    @Column(name = "personname", nullable = false, length = 100)
    private String personname;

    @Column(name = "phonenumber", nullable = false, length = 20)
    private String phonenumber;

    @Column(name = "typedocument", nullable = false, length = 3)
    private String typedocument;

    @Column(name = "personaddress", nullable = false, length = 100)
    private String personaddress;

    @Column(name = "persontype", nullable = false, length = 45)
    private String persontype;

}