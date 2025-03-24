package com.autopartes.BackendAutoPartes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "persons")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String documentType;
    private String document;
    private String phoneNumber;
    private String address;

    @OneToOne(mappedBy = "person")
    private User user;

    @OneToMany(mappedBy = "person")
    private List<Bill> bills;
}
