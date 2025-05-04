package com.autopartes.BackendAutoPartes.model.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemSold {
    @NotNull
    private Integer batchId;

    @Min(1)
    private int quantity;
}
