package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Usertype;
import com.autopartes.BackendAutoPartes.model.dto.request.UserTypeRequest;
import com.autopartes.BackendAutoPartes.service.UserTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usertype")
public class UserTypeController {

    private final UserTypeService userTypeService;

    public UserTypeController(UserTypeService userTypeService) {
        this.userTypeService = userTypeService;
    }

    /**
     * Get all user types.
     *
     * @return List of all user types.
     */
    @GetMapping
    public ResponseEntity<List<Usertype>> getAllUserTypes() {
        return ResponseEntity.ok(userTypeService.findAll());
    }

    /**
     * Get a user type by ID.
     *
     * @param id The ID of the user type.
     * @return The user type if found, or 404 if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usertype> getUserTypeById(@PathVariable Integer id) {
        return userTypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new user type.
     *
     * @param request The user type data.
     * @return The created user type.
     */
    @PostMapping
    public ResponseEntity<Usertype> createUserType(@Valid @RequestBody UserTypeRequest request) {
        Usertype createdUsertype = userTypeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUsertype);
    }

    /**
     * Update an existing user type.
     *
     * @param id The ID of the user type to update.
     * @param request The new user type data.
     * @return The updated user type if found, or 404 if not found.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Usertype> updateUserType(
            @PathVariable Integer id,
            @Valid @RequestBody UserTypeRequest request) {
        return userTypeService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a user type by ID.
     *
     * @param id The ID of the user type to delete.
     * @return 204 No Content if deleted, or 404 if not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserType(@PathVariable Integer id) {
        if (userTypeService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}