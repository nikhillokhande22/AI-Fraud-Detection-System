package com.example.fraud.controller;

import com.example.fraud.model.User;
import com.example.fraud.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        String token = authService.login(user.getEmail(), user.getPassword());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}
