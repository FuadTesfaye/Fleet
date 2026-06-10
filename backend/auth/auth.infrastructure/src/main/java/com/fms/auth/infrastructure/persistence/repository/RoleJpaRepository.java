package com.fms.auth.infrastructure.persistence.repository;

import com.fms.auth.domain.enums.RoleType;
import com.fms.auth.infrastructure.persistence.entity.RoleJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleJpaRepository extends JpaRepository<RoleJpaEntity, UUID> {
    Optional<RoleJpaEntity> findByType(RoleType type);
}
