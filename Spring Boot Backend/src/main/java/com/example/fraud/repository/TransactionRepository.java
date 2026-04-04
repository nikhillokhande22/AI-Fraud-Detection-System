
package com.example.fraud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.fraud.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {}
