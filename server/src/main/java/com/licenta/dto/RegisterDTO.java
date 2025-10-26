package com.licenta.dto;


import com.licenta.enums.Role;
import lombok.*;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterDTO {
    private String username;
    private String fullName;
    private String email;
    private String password;
    private String confirmedPassword;
}
