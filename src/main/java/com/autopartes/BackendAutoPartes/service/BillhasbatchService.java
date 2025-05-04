package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Billhasbatch;
import com.autopartes.BackendAutoPartes.model.dto.BillhasbatchId;
import com.autopartes.BackendAutoPartes.repository.BillhasbatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillhasbatchService {

    private final BillhasbatchRepository repository;

    public BillhasbatchService(BillhasbatchRepository repository) {
        this.repository = repository;
    }

    public List<Billhasbatch> findAll() {
        return repository.findAll();
    }

    public Optional<Billhasbatch> findById(BillhasbatchId id) {
        return repository.findById(id);
    }

    public Billhasbatch save(Billhasbatch billhasbatch) {
        return repository.save(billhasbatch);
    }

    public void deleteById(BillhasbatchId id) {
        repository.deleteById(id);
    }
}
