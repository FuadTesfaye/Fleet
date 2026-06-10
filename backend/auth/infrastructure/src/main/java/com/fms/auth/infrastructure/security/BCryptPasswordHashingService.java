package com.fms.auth.infrastructure.security;

import com.fms.auth.application.port.output.PasswordHashingPort;
import com.fms.auth.domain.valueobject.HashedPassword;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class BCryptPasswordHashingService implements PasswordHashingPort {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public HashedPassword hash(String plainPassword) {
        return new HashedPassword(encoder.encode(plainPassword));
    }

    @Override
    public boolean matches(String plainPassword, HashedPassword hashedPassword) {
        return encoder.matches(plainPassword, hashedPassword.hash());
    }
}
