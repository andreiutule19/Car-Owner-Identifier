package com.licenta.service.sketch;

import com.licenta.dto.LicensePlateDTO;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface LicensePlateService {
    LicensePlateDTO detectLicensePlate(MultipartFile file);
    Map<String, String> debugLicensePlate(int number);
}
