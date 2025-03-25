package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private Integer id;

    @Column(name = "description", length = 150)
    private String description;

    @Column(name = "usertypename", nullable = false, length = 45)
    private String usertypename;

}