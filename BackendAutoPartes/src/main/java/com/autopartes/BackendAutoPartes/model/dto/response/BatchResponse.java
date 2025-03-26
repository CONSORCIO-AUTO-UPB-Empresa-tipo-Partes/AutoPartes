package com.autopartes.BackendAutoPartes.model.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class BatchResponse {
    private Integer id;
    private Instant datearrival;
    private Integer quantity;
    private BigDecimal purchaseprice;
    private BigDecimal unitpurchaseprice;
    private BigDecimal unitsaleprice;
    private String itemdescription;
    private String itemName;
    private String providerName;
}
