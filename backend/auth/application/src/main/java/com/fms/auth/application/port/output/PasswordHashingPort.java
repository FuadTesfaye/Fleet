package com.fms.auth.application.port.output;

import com.fms.auth.domain.valueobject.HashedPassword;

public interface PasswordHashingPort {
    HashedPassword hash(String plainPassword);

    boolean matches(String plainPassword, HashedPassword hashedPassword);
}
