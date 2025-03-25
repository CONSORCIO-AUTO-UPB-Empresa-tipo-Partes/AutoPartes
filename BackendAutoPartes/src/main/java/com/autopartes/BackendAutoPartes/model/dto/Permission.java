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
@Table(name = "permissions", schema = "autopartes")
public class Permission {
    @Id
    @ColumnDefault("nextval('autopartes.permissions_idpermissions_seq')")
    @Column(name = "idpermissions", nullable = false)
    private Integer id;

    @Column(name = "name_permissions", length = 45)
    private String namePermissions;

    @Column(name = "permissiondescription", length = 250)
    private String permissiondescription;

}