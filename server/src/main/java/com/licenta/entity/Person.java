package com.licenta.entity;

import com.licenta.enums.LegalStatus;
import com.licenta.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name="`Person`")
@Builder
@AllArgsConstructor
public class Person {

    @Id
    @Column(name="person_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long personId;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private LegalStatus legalStatus;

    public Person(String fullName, LegalStatus legalStatus) {
        this.fullName = fullName;
        this.legalStatus = legalStatus;
    }


}
