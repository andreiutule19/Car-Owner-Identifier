package com.licenta.service.sketch;

import com.licenta.dto.LoginDTO;
import com.licenta.dto.RegisterDTO;
import com.licenta.dto.TokenResponseDTO;

public interface UserService {

    TokenResponseDTO register(final RegisterDTO user);
    TokenResponseDTO login(final LoginDTO loginDTO);


}
