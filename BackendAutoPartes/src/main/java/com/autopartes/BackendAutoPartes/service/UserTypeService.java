package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Usertype;
import com.autopartes.BackendAutoPartes.model.dto.request.UserTypeRequest;
import com.autopartes.BackendAutoPartes.repository.UsertypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserTypeService {

    private final UsertypeRepository usertypeRepository;

    public UserTypeService(UsertypeRepository usertypeRepository) {
        this.usertypeRepository = usertypeRepository;
    }

    /**
     * Retrieves all user types.
     *
     * @return List of all user types.
     */
    public List<Usertype> findAll() {
        return usertypeRepository.findAll();
    }

    /**
     * Finds a user type by ID.
     *
     * @param id The ID of the user type to find.
     * @return Optional containing the user type or empty if not found.
     */
    public Optional<Usertype> findById(Integer id) {
        return usertypeRepository.findById(id);
    }

    /**
     * Creates a new user type.
     *
     * @param request The user type data.
     * @return The created user type.
     */
    public Usertype create(UserTypeRequest request) {
        Usertype usertype = new Usertype();
        usertype.setUsertypename(request.getUsertypename());
        usertype.setDescription(request.getDescription());
        return usertypeRepository.save(usertype);
    }

    /**
     * Updates an existing user type.
     *
     * @param id The ID of the user type to update.
     * @param request The new user type data.
     * @return Optional containing the updated user type or empty if not found.
     */
    public Optional<Usertype> update(Integer id, UserTypeRequest request) {
        return usertypeRepository.findById(id)
                .map(usertype -> {
                    usertype.setUsertypename(request.getUsertypename());
                    usertype.setDescription(request.getDescription());
                    return usertypeRepository.save(usertype);
                });
    }

    /**
     * Deletes a user type by ID.
     *
     * @param id The ID of the user type to delete.
     * @return true if deleted, false if not found.
     */
    public boolean deleteById(Integer id) {
        if (usertypeRepository.existsById(id)) {
            usertypeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}