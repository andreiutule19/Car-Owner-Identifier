package com.licenta.controller;

import com.licenta.dto.LoginDTO;
import com.licenta.dto.RegisterDTO;
import com.licenta.dto.TokenResponseDTO;
import com.licenta.service.sketch.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO authDTO) {
        try {
            TokenResponseDTO response = authService.register(authDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid input data!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            TokenResponseDTO response = authService.login(loginDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }
    }
}
