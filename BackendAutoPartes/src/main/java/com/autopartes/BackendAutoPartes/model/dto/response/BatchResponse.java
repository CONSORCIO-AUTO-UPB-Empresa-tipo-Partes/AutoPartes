package com.autopartes.BackendAutoPartes.model.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class BatchResponse {
    private Integer id;
    @JsonIgnore
    private Instant datearrival;
    private Integer quantity;
    private BigDecimal purchaseprice;
    private BigDecimal unitpurchaseprice;
    private BigDecimal unitsaleprice;
    private Integer monthsofwarranty;
    private String itemdescription;
    private String itemName;
    private String providerName;
    private String warrantyindays;
    private Boolean havewarranty;
    private Integer initialquantity;
}