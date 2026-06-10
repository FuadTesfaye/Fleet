package com.fms.auth.domain.repository;

import com.fms.auth.domain.entity.Role;
import com.fms.auth.domain.enums.RoleType;
import java.util.Optional;
import java.util.UUID;

public interface RoleRepository {
    Role save(Role role);

    Optional<Role> findById(UUID id);

    Optional<Role> findByType(RoleType type);
}
