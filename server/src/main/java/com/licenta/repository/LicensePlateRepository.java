package com.licenta.repository;

import com.licenta.entity.LicensePlate;
import com.licenta.entity.Person;
import com.licenta.enums.Country;
import com.licenta.enums.County;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LicensePlateRepository extends JpaRepository<LicensePlate, Long> {
    @Query("SELECT lp.person FROM LicensePlate lp WHERE lp.county = :county AND lp.country = :country AND lp.licenseNumber = :licenseNumber")
    Optional<Person> findUserByCountyAndCountryAndLicenseNumber(@Param("county") County county, @Param("country") Country country, @Param("licenseNumber") String licenseNumber);

}
