package com.licenta.dto;


import lombok.*;
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginDTO {
    private String username;
    private String password;
}
