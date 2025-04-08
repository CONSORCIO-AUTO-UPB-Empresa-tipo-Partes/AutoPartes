package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "usertype", schema = "autopartes")
public class Usertype {

    @Id
    @ColumnDefault("nextval('autopartes.usertype_idtypeuser_seq')")
    @Column(name = "idtypeuser", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "description", length = 150)
    private String description;

    @Column(name = "usertypename", nullable = false, length = 45)
    private String usertypename;
}