package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Bill;
import com.autopartes.BackendAutoPartes.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillService {
    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }
}
