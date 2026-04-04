package com.example.fraud.service;

import com.example.fraud.model.Transaction;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendFraudAlert(String toEmail, Transaction transaction) {
        System.out.println("=================================");
        System.out.println("FRAUD ALERT");
        System.out.println("To: " + toEmail);
        System.out.println("Amount: " + transaction.getAmount());
        System.out.println("Location: " + transaction.getLocation());
        System.out.println("Device: " + transaction.getDevice());
        System.out.println("Risk Score: " + transaction.getRiskScore());
        System.out.println("=================================");
    }
}
