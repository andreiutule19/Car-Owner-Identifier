package com.licenta.dto;

import com.licenta.enums.Country;
import com.licenta.enums.County;
import com.licenta.enums.LegalStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class LicensePlateDTO {
    private County county;
    private final Country country = Country.RO;
    private String licenseNumber;
    private String fullName;
    private LegalStatus legalStatus;
}
