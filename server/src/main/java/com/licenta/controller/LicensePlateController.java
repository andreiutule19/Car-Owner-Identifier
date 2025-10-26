package com.licenta.controller;

import com.licenta.dto.LicensePlateDTO;
import com.licenta.service.sketch.LicensePlateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/license")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LicensePlateController {

    private final LicensePlateService licensePlateService;
    @PostMapping
    public ResponseEntity<?> detectLicensePlate(@RequestParam("image")  MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No file uploaded");
            }
            LicensePlateDTO response = licensePlateService.detectLicensePlate(file);   
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No license plate found.");
        }
    }

    @GetMapping("/debug/{number}")
    public ResponseEntity<Map<String, String>> getImages(@PathVariable int number) {
        Map<String, String> images = licensePlateService.debugLicensePlate(number);

        if (images != null && !images.isEmpty()) {
            return ResponseEntity.ok(images);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}