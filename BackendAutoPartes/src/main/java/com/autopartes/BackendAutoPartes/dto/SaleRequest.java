package com.autopartes.BackendAutoPartes.dto;

import com.autopartes.BackendAutoPartes.model.Person;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SaleRequest {
    private List<SaleItem> items;
    private Person buyer; // Representa a la persona que compra
}
