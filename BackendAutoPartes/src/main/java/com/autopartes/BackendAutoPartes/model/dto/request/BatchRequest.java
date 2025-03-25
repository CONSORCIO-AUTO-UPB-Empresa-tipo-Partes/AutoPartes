package com.autopartes.BackendAutoPartes.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class BatchRequest {

    @NotNull
    private Instant datearrival;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    private BigDecimal purchaseprice;

    @NotNull
    private BigDecimal unitpurchaseprice;

    @NotNull
    private BigDecimal unitsaleprice;

    private Integer monthsofwarranty;

    private String itemdescription;

    @NotNull(message = "Debe especificar el ID del item")
    private Integer itemId;

    @NotNull(message = "Debe especificar el ID del proveedor")
    private Integer providerId;

    private String warrantyindays;

    private Boolean havewarranty = false;
}
