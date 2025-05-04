package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "usertypehaspermissions", schema = "autopartes")
public class Usertypehaspermission {
    @EmbeddedId
    private UsertypehaspermissionId id;

    @MapsId("usertypeIdtypeuser")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "usertype_idtypeuser", nullable = false)
    private Usertype usertypeIdtypeuser;

    @MapsId("permissionsIdpermissions")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "permissions_idpermissions", nullable = false)
    private Permission permissionsIdpermissions;

}