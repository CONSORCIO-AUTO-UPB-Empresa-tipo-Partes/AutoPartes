package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.*;
import com.autopartes.BackendAutoPartes.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleService {
    private final BillRepository billRepository;
    private final BillHasBatchRepository billHasBatchRepository;
    private final BatchRepository batchRepository;
    private final PersonRepository personRepository;

    public SaleService(BillRepository billRepository, BillHasBatchRepository billHasBatchRepository,
                       BatchRepository batchRepository, PersonRepository personRepository) {
        this.billRepository = billRepository;
        this.billHasBatchRepository = billHasBatchRepository;
        this.batchRepository = batchRepository;
        this.personRepository = personRepository;
    }

    @Transactional
    public Bill createBill(Long personId, List<Long> batchIds, List<Integer> quantities) {
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new RuntimeException("Person not found"));

        Bill bill = new Bill();
        bill.setInvoiceNumber("INV-" + System.currentTimeMillis());
        bill.setDate(LocalDateTime.now());
        bill.setPerson(person);

        double totalPrice = 0.0;
        double tax = 0.0;
        double discountAmount = 0.0;

        double[] subtotalWithoutTax = {0.0}; // Usamos un array para ser mutable en la lambda

        List<BillHasBatch> billHasBatches = batchIds.stream()
                .map(batchId -> {
                    Batch batch = batchRepository.findById(batchId)
                            .orElseThrow(() -> new RuntimeException("Batch not found"));

                    int index = batchIds.indexOf(batchId);
                    if (index == -1) {
                        throw new RuntimeException("Batch ID not found in request");
                    }
                    int quantity = quantities.get(index);

                    if (batch.getQuantity() < quantity) {
                        throw new RuntimeException("Insufficient stock in batch: " + batch.getLotCode());
                    }

                    BillHasBatch billHasBatch = new BillHasBatch();
                    billHasBatch.setBill(bill);
                    billHasBatch.setBatch(batch);
                    billHasBatch.setAmountSold(quantity);

                    batch.setQuantity(batch.getQuantity() - quantity);
                    batchRepository.save(batch);

                    // 🔹 Evita problemas si el precio de venta es nulo
                    double salePrice = Optional.ofNullable(batch.getSalePrice()).orElse(0.0);
                    subtotalWithoutTax[0] += salePrice * quantity;

                    return billHasBatch;
                }).collect(Collectors.toList());

        // Después de la lambda, usamos subtotalWithoutTax[0]
        tax = subtotalWithoutTax[0] * 0.19; // 19% IVA
        totalPrice = subtotalWithoutTax[0] + tax - discountAmount;

        bill.setSubtotalWithoutTax(subtotalWithoutTax[0]);
        bill.setTax(tax);
        bill.setTotalPrice(totalPrice);
        bill.setHasDiscount(discountAmount > 0);
        bill.setDiscountAmount(discountAmount);
        bill.setBillHasBatches(billHasBatches);

        billRepository.save(bill);
        billHasBatchRepository.saveAll(billHasBatches);

        return bill;
    }
}
