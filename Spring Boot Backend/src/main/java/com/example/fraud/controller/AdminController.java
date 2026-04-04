package com.example.fraud.controller;

import com.example.fraud.model.Transaction;
import com.example.fraud.model.User;
import com.example.fraud.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService service;

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboard() {
        return service.getDashboardData();
    }

    @GetMapping("/risk-graph")
    public Map<String, Long> riskGraph() {
        return service.riskGraph();
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return service.getAllTransactions();
    }

    @GetMapping("/transactions/fraud")
    public List<Transaction> getFraudTransactions() {
        return service.getFraudTransactions();
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return service.getUsers();
    }

    @PostMapping("/users/{id}/block")
    public User blockUser(@PathVariable Long id) {
        return service.blockUser(id);
    }

    @PostMapping("/users/{id}/unblock")
    public User unblockUser(@PathVariable Long id) {
        return service.unblockUser(id);
    }
}
