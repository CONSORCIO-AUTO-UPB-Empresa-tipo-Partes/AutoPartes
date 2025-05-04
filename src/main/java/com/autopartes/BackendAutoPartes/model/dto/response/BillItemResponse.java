package com.autopartes.BackendAutoPartes.model.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BillItemResponse {
    private Integer batchId;
    private String itemName;
    private String itemDescription;
    private Integer quantitySold;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}