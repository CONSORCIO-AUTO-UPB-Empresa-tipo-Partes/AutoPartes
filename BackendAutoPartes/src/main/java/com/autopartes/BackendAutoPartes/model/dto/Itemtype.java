package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "itemtype", schema = "autopartes")
public class Itemtype {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "itemtype_seq")
    @SequenceGenerator(name = "itemtype_seq", sequenceName = "autopartes.itemtype_iditem_seq", allocationSize = 1)
    @Column(name = "iditem", nullable = false)
    private Integer id;

    @Column(name = "itemname", length = 45)
    private String itemname;

    @Column(name = "imagepath")
    private String imagepath;

}