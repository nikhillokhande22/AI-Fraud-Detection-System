
package com.example.fraud.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.fraud.model.Transaction;
import com.example.fraud.model.User;
import com.example.fraud.repository.TransactionRepository;
import com.example.fraud.repository.UserRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repo;

    @Autowired
    private UserRepository userRepo;

    public Transaction processTransaction(Transaction t) {

        User user = userRepo.findById(t.getUser().getId()).orElseThrow();

        if (t.getType().equalsIgnoreCase("withdraw")) {
            if (user.getBalance() < t.getAmount()) {
                throw new RuntimeException("Insufficient balance");
            }
            user.setBalance(user.getBalance() - t.getAmount());
        } else {
            user.setBalance(user.getBalance() + t.getAmount());
        }

        if (t.getAmount() > 50000 && !t.getLocation().equalsIgnoreCase("Mumbai")) {
            t.setFraud(true);
        } else {
            t.setFraud(false);
        }

        t.setUser(user);
        return repo.save(t);
    }
}
