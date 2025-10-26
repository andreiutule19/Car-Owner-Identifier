package com.licenta.service.impl;

import com.licenta.dto.LoginDTO;
import com.licenta.dto.RegisterDTO;
import com.licenta.dto.TokenResponseDTO;
import com.licenta.entity.User;
import com.licenta.enums.Role;

import com.licenta.exceptions.ResourceNotFoundException;
import com.licenta.repository.UserRepository;
import com.licenta.service.sketch.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.AuthenticationException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final JwtServiceImpl jwtServiceImpl;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern VALID_EMAIL_ADDRESS_REGEX =
            Pattern.compile("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$", Pattern.CASE_INSENSITIVE);
    private static final Pattern VALID_PASSWORD_REGEX =
            Pattern.compile("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", Pattern.CASE_INSENSITIVE);

    @Override
    @Transactional
    public TokenResponseDTO register(RegisterDTO user) {
        if (checkFields(user)) {
            User userAuth = User.builder()
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .password(passwordEncoder.encode(user.getPassword()))
                    .role(Role.CLIENT)
                    .build();
            userRepository.save(userAuth);
        } else throw new ResourceNotFoundException("Something is not quite right !");
        String jwtToken = jwtServiceImpl.generateToken(modelMapper.map(user, User.class));
        return TokenResponseDTO.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(Role.CLIENT)
                .build();
    }

    @Override
    @Transactional
    public TokenResponseDTO login(LoginDTO loginDTO) {
        logger.info("Creating a new user: {}", loginDTO.getUsername());
        logger.info("Creating a new user: {}", loginDTO.getPassword());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for user: {}", loginDTO.getUsername(), e);
            throw e;
        }
        Optional<User> user = userRepository.findByUsername(loginDTO.getUsername());
        logger.info("User", user);
        if(user.isPresent()) {
            String jwtToken = jwtServiceImpl.generateToken(user.get());
            return TokenResponseDTO.builder()
                    .token(jwtToken)
                    .username(user.get().getUsername())
                    .fullName(user.get().getFullName())
                    .email(user.get().getEmail())
                    .userId(user.get().getUserId())
                    .role(user.get().getRole())
                    .build();
        }
        throw new ResourceNotFoundException("User not found !");

    }

    private static boolean validate(final String stringToValidate, final Pattern pattern) {
        final Matcher matcher = pattern.matcher(stringToValidate);
        return matcher.matches();
    }

    private boolean checkFields(RegisterDTO user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            return false;
        }
        if (user.getEmail() == null || user.getEmail().isBlank() ||
                !validate(user.getEmail(), VALID_EMAIL_ADDRESS_REGEX)) {
            return false;
        }
        if (user.getPassword() == null || user.getPassword().isBlank() ||
                !user.getPassword().equals(user.getConfirmedPassword()) || !validate(user.getPassword(), VALID_PASSWORD_REGEX)) {
            return false;
        }
        return true;
    }
}
