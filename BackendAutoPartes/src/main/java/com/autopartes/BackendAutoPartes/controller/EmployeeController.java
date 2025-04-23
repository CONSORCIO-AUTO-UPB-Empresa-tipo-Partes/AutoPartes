package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.request.EmployeeRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.EmployeeResponse;
import com.autopartes.BackendAutoPartes.security.JwtUtils;
import com.autopartes.BackendAutoPartes.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for handling employee-related operations.
 */
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final JwtUtils jwtUtils;

    public EmployeeController(EmployeeService employeeService, JwtUtils jwtUtils) {
        this.employeeService = employeeService;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Create a new employee.
     *
     * @param request The employee details.
     * @return The response entity with the result of the operation.
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<?> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        return employeeService.createEmployee(request)
                .map(employee -> ResponseEntity.ok(Map.of("message", "Empleado creado correctamente", "employee", employee)))
                .orElse(ResponseEntity.status(409)
                        .body(Map.of("error", "Ya existe un empleado con ese correo o documento")));
    }

    /**
     * Get all employees.
     *
     * @return The response entity with the list of employees.
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        List<EmployeeResponse> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    /**
     * Get an employee by ID.
     *
     * @param id The employee ID (document number).
     * @return The response entity with the employee details.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<?> getEmployeeById(@PathVariable String id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(null));
    }

    /**
     * Update an employee.
     *
     * @param id The employee ID (document number).
     * @param request The updated employee details.
     * @return The response entity with the result of the operation.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @Valid @RequestBody EmployeeRequest request) {
        return employeeService.updateEmployee(id, request)
                .map(employee -> ResponseEntity.ok(Map.of("message", "Empleado actualizado correctamente", "employee", employee)))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Empleado no encontrado")));
    }

    /**
     * Delete an employee.
     *
     * @param id The employee ID (document number).
     * @return The response entity with the result of the operation.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        boolean deleted = employeeService.deleteEmployee(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Empleado eliminado correctamente"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Empleado no encontrado"));
    }
}