package com.autopartes.BackendAutoPartes.repository;

     import com.autopartes.BackendAutoPartes.model.dto.Usertoken;
     import org.springframework.data.jpa.repository.JpaRepository;

     import java.util.Optional;

     public interface UsertokenRepository extends JpaRepository<Usertoken, Integer> {
         Optional<Usertoken> findByToken(String token);
     }