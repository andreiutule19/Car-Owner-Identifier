package com.licenta.dto;

import com.licenta.enums.Role;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TokenResponseDTO {
    private Long userId;
    private String fullName;
    private String email;
    private String username;
    private Role role;
    private String token;
}
