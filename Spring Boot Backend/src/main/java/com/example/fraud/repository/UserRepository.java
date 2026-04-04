
package com.example.fraud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.fraud.model.User;

public interface UserRepository extends JpaRepository<User, Long> {}
