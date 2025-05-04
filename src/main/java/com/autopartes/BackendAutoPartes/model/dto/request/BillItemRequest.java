package com.autopartes.BackendAutoPartes.model.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillItemRequest {

    @NotNull
    private Integer batchId;

    @NotNull
    @Min(1)
    private Integer quantity;
}