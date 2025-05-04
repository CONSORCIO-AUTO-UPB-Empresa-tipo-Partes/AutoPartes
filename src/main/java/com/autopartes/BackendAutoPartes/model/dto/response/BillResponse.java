package com.autopartes.BackendAutoPartes.model.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class BillResponse {
    private Integer id;
    private Instant billDate;
    private BigDecimal totalPrice;
    private BigDecimal tax;
    private BigDecimal totalPriceWithoutTax;
    private Boolean hasDiscount;
    private BigDecimal discountRate;
    private String customerDocument;
    private String customerName;
    private List<BillItemResponse> items;
}