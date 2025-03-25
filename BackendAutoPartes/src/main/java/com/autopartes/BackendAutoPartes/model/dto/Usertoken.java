package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "usertokens", schema = "autopartes")
public class Usertoken {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usertokens_seq")
    @SequenceGenerator(
            name = "usertokens_seq",
            sequenceName = "autopartes.usertokens_idtokens_seq",
            allocationSize = 1
    )
    @Column(name = "idtokens", nullable = false)
    private Integer id;

    @Column(name = "token", nullable = false, length = 500)
    private String token;

    @Column(name = "expiresat")
    private Instant expiresat;

    @Column(name = "createdat")
    private Instant createdat;

    @Column(name = "usertokenscol")
    private Boolean usertokenscol;

}