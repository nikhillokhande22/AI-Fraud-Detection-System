
package com.example.fraud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.fraud.model.Transaction;
import com.example.fraud.service.TransactionService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService service;

    @PostMapping("/transaction")
    public Transaction createTransaction(@RequestBody Transaction t) {
        return service.processTransaction(t);
    }
}
