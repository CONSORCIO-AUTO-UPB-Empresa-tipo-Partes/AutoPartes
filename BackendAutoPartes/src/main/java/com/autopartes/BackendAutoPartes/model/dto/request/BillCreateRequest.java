package com.autopartes.BackendAutoPartes.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BillCreateRequest {

    @NotNull
    private String customerDocument;

    @NotNull
    private BigDecimal totalPrice;

    private boolean hasDiscount;
    private BigDecimal discountRate;

    @NotNull
    private List<ItemSold> items; // lista de lotes vendidos

    private LocalDateTime date;

}
