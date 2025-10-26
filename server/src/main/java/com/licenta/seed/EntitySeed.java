package com.licenta.seed;

import com.licenta.entity.LicensePlate;
import com.licenta.entity.Person;
import com.licenta.entity.User;
import com.licenta.enums.County;
import com.licenta.enums.LegalStatus;
import com.licenta.repository.LicensePlateRepository;
import com.licenta.repository.PersonRepository;
import com.licenta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EntitySeed implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LicensePlateRepository plateRepository;
    private final PersonRepository personRepository;
    @Override
    public void run(String... args) throws Exception {
        if(personRepository.findAll().isEmpty()){
            personRepository.save(new Person("Iuliu Andrei Steau", LegalStatus.NATURAL));
            personRepository.save(new Person("Roxana Hirean", LegalStatus.NATURAL));
            personRepository.save(new Person("Vecinul Antreprenor", LegalStatus.LEGAL));
        }
        if(plateRepository.findAll().isEmpty()){
            LicensePlate licensePlate = new LicensePlate();
            licensePlate.setPerson(personRepository.findAll().get(0));
            licensePlate.setLicenseNumber("18ANE");
            licensePlate.setCounty(County.AB);
            plateRepository.save(licensePlate);

            LicensePlate licensePlate2 = new LicensePlate();
            licensePlate2.setPerson(personRepository.findAll().get(0));
            licensePlate2.setLicenseNumber("70LDA");
            licensePlate2.setCounty(County.AB);
            plateRepository.save(licensePlate2);

            LicensePlate licensePlate3 = new LicensePlate();
            licensePlate3.setPerson(personRepository.findAll().get(1));
            licensePlate3.setLicenseNumber("05BFJ");
            licensePlate3.setCounty(County.AB);
            plateRepository.save(licensePlate3);

            LicensePlate licensePlate4 = new LicensePlate();
            licensePlate4.setPerson(personRepository.findAll().get(2));
            licensePlate4.setLicenseNumber("10PRL");
            licensePlate4.setCounty(County.AB);
            plateRepository.save(licensePlate4);

        }


    }
}
