package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "provider", schema = "autopartes")
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "provider_seq")
    @SequenceGenerator(name = "provider_seq", sequenceName = "autopartes.provider_idprovider_seq", allocationSize = 1)
    @Column(name = "idprovider", nullable = false)
    private Integer idprovider;


    @Column(name = "name", nullable = false, length = 45)
    @NotBlank(message = "El nombre del proveedor es obligatorio")
    private String name;

}