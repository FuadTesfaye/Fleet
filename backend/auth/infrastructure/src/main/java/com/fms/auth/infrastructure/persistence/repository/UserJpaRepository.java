package com.fms.auth.infrastructure.persistence.repository;

import com.fms.auth.infrastructure.persistence.entity.UserJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {
    Optional<UserJpaEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
