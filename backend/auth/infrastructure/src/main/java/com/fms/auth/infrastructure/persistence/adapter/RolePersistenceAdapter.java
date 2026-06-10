package com.fms.auth.infrastructure.persistence.adapter;

import com.fms.auth.application.port.output.RolePersistencePort;
import com.fms.auth.domain.entity.Role;
import com.fms.auth.domain.enums.RoleType;
import com.fms.auth.infrastructure.persistence.entity.RoleJpaEntity;
import com.fms.auth.infrastructure.persistence.repository.RoleJpaRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RolePersistenceAdapter implements RolePersistencePort {

    private final RoleJpaRepository roleJpaRepository;

    @Override
    public Role save(Role role) {
        RoleJpaEntity entity = new RoleJpaEntity();
        entity.setId(role.getId());
        entity.setName(role.getName());
        entity.setType(role.getType());
        RoleJpaEntity saved = roleJpaRepository.save(entity);
        return new Role(saved.getId(), saved.getName(), saved.getType());
    }

    @Override
    public Optional<Role> findById(UUID id) {
        return roleJpaRepository.findById(id)
                .map(e -> new Role(e.getId(), e.getName(), e.getType()));
    }

    @Override
    public Optional<Role> findByType(RoleType type) {
        return roleJpaRepository.findByType(type)
                .map(e -> new Role(e.getId(), e.getName(), e.getType()));
    }
}
