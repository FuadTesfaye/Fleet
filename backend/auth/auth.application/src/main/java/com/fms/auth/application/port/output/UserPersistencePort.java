package com.fms.auth.application.port.output;

import com.fms.auth.domain.entity.User;
import com.fms.auth.domain.valueobject.Email;
import com.fms.auth.domain.valueobject.UserId;
import java.util.Optional;

public interface UserPersistencePort {
    User save(User user);

    Optional<User> findByEmail(Email email);

    Optional<User> findById(UserId userId);

    boolean existsByEmail(Email email);
}
