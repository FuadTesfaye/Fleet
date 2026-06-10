package com.fms.auth.infrastructure.persistence.adapter;

import com.fms.auth.application.port.output.UserPersistencePort;
import com.fms.auth.domain.entity.User;
import com.fms.auth.domain.valueobject.Email;
import com.fms.auth.domain.valueobject.UserId;
import com.fms.auth.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.fms.auth.infrastructure.persistence.repository.UserJpaRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserPersistencePort {

    private final UserJpaRepository userJpaRepository;
    private final UserPersistenceMapper mapper;

    @Override
    public User save(User user) {
        return mapper.toDomain(userJpaRepository.save(mapper.toJpaEntity(user)));
    }

    @Override
    public Optional<User> findByEmail(Email email) {
        return userJpaRepository.findByEmail(email.value()).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findById(UserId userId) {
        return userJpaRepository.findById(userId.value()).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(Email email) {
        return userJpaRepository.existsByEmail(email.value());
    }
}
