package com.example.fraud.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.fraud.model.Transaction;
import com.example.fraud.model.User;
import com.example.fraud.repository.TransactionRepository;
import com.example.fraud.repository.UserRepository;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private UserRepository userRepo;

    // ✅ All Transactions
    public List<Transaction> getAllTransactions(){
        return transactionRepo.findAll();
    }

    // ✅ Fraud Transactions
    public List<Transaction> getFraudTransactions(){
        return transactionRepo.findByFraudTrue();
    }

    // ✅ All Users
    public List<User> getUsers(){
        return userRepo.findAll();
    }

    // ✅ Fraud Count
    public long getFraudCount(){
        return transactionRepo.findByFraudTrue().size();
    }

    // ✅ Total Count
    public long getTotalCount(){
        return transactionRepo.count();
    }

    // ✅ Safe Transactions
    public long getSafeTransactions(){
        return transactionRepo.count() - transactionRepo.findByFraudTrue().size();
    }

    // ✅ Dashboard Data
    public Map<String, Long> getDashboardData(){

        Map<String, Long> data = new HashMap<>();

        data.put("totalTransactions", getTotalCount());
        data.put("fraudTransactions", getFraudCount());
        data.put("safeTransactions", getSafeTransactions());
        data.put("totalUsers", userRepo.count());

        return data;
    }

    // ✅ Risk Score Graph
    public Map<String, Long> riskGraph(){

        Map<String, Long> data = new HashMap<>();

        long lowRisk = transactionRepo.findAll()
                .stream()
                .filter(t -> t.getRiskScore() < 30)
                .count();

        long mediumRisk = transactionRepo.findAll()
                .stream()
                .filter(t -> t.getRiskScore() >= 30 && t.getRiskScore() < 60)
                .count();

        long highRisk = transactionRepo.findAll()
                .stream()
                .filter(t -> t.getRiskScore() >= 60)
                .count();

        data.put("low", lowRisk);
        data.put("medium", mediumRisk);
        data.put("high", highRisk);

        return data;
    }

    // ✅ Block User
    public User blockUser(Long id){

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(true);

        return userRepo.save(user);
    }

    // ✅ Unblock User
    public User unblockUser(Long id){

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(false);

        return userRepo.save(user);
    }

}