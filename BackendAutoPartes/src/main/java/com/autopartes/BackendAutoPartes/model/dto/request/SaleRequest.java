package com.autopartes.BackendAutoPartes.model.dto.request;

import com.autopartes.BackendAutoPartes.model.dto.Person;
import com.autopartes.BackendAutoPartes.model.dto.SaleItem;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SaleRequest {
    private List<SaleItem> items;
    private Person buyer; // Representa a la persona que compra
}
