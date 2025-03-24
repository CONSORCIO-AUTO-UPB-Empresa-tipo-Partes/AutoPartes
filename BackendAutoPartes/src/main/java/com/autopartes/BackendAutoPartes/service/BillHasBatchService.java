package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.BillHasBatch;
import com.autopartes.BackendAutoPartes.repository.BillHasBatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillHasBatchService {
    private final BillHasBatchRepository billHasBatchRepository;

    public BillHasBatchService(BillHasBatchRepository billHasBatchRepository) {
        this.billHasBatchRepository = billHasBatchRepository;
    }

    public List<BillHasBatch> getAllBillBatches() {
        return billHasBatchRepository.findAll();
    }

    public BillHasBatch saveBillBatch(BillHasBatch billHasBatch) {
        return billHasBatchRepository.save(billHasBatch);
    }
}
