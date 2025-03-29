package com.autopartes.BackendAutoPartes.model.dto.response;

import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import java.util.List;

public class ItemtypeWithBatchesResponse {
    private Itemtype itemType;
    private List<BatchResponse> batches;

    public ItemtypeWithBatchesResponse() {
    }

    public ItemtypeWithBatchesResponse(Itemtype itemType, List<BatchResponse> batches) {
        this.itemType = itemType;
        this.batches = batches;
    }

    public Itemtype getItemType() {
        return itemType;
    }

    public void setItemType(Itemtype itemType) {
        this.itemType = itemType;
    }

    public List<BatchResponse> getBatches() {
        return batches;
    }

    public void setBatches(List<BatchResponse> batches) {
        this.batches = batches;
    }
}