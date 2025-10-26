package com.licenta.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.licenta.dto.LicensePlateDTO;
import com.licenta.entity.Person;
import com.licenta.enums.Country;
import com.licenta.enums.County;
import com.licenta.enums.LegalStatus;
import com.licenta.exceptions.ResourceNotFoundException;
import com.licenta.repository.LicensePlateRepository;
import com.licenta.service.sketch.LicensePlateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LicensePlateServiceImpl implements LicensePlateService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_SERVICE_URL = "http://localhost:8000";
    private final LicensePlateRepository plateRepository;

    @Override
    public LicensePlateDTO detectLicensePlate(MultipartFile file) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(PYTHON_SERVICE_URL+"/detect", HttpMethod.POST,
                requestEntity, String.class);
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            String licensePlate = jsonNode.get("license_plate").asText();
            String firstPart;
            String restPart;
            if (Character.isDigit(licensePlate.charAt(1))) {
                firstPart = licensePlate.substring(0, 1);
                restPart = licensePlate.substring(1);
            } else {
                firstPart = licensePlate.substring(0, 2);
                restPart = licensePlate.substring(2);
            }
            Optional<Person> personOptional =
                    plateRepository.findUserByCountyAndCountryAndLicenseNumber(
                            County.valueOf(firstPart), Country.RO,restPart);
            LicensePlateDTO licensePlateDTO = new LicensePlateDTO();
            licensePlateDTO.setLicenseNumber(restPart);
            licensePlateDTO.setCounty(County.valueOf(firstPart));
            if (personOptional.isPresent()) {
                Person person = personOptional.get();
                licensePlateDTO.setFullName(person.getFullName());
                licensePlateDTO.setLegalStatus(person.getLegalStatus());
                return licensePlateDTO;
            }
            licensePlateDTO.setFullName("UNKNOWN");
            licensePlateDTO.setLegalStatus(LegalStatus.valueOf("UNKNOWN"));
            System.out.println("Response headers: " + response.getHeaders());
            return licensePlateDTO;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error detecting license plate !");
        }
    }

    public Map<String, String> debugLicensePlate(int number) {
        String url = UriComponentsBuilder.fromHttpUrl(PYTHON_SERVICE_URL + "/debug/" + number).toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Response status: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            return response.getBody();
        } else {
            System.out.println("Failed to fetch images. Status code: " + response.getStatusCode());
            throw new ResourceNotFoundException("Images not found!");
        }
    }

}
