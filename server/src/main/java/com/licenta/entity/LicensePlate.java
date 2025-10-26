package com.licenta.entity;

import com.licenta.enums.Country;
import com.licenta.enums.County;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name="License Plate")
public class LicensePlate {
    @Id
    @Column(name="license_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long licenseId;

    private County county;
    private final Country country = Country.RO;
    private String licenseNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "person_id")
    private Person person;


}
