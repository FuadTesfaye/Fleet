package com.fms.auth.infrastructure.persistence.mapper;

import com.fms.auth.domain.entity.Role;
import com.fms.auth.domain.entity.User;
import com.fms.auth.infrastructure.persistence.entity.RoleJpaEntity;
import com.fms.auth.infrastructure.persistence.entity.UserJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserPersistenceMapper {

    @Mapping(target = "userId", expression = "java(new com.fms.auth.domain.valueobject.UserId(entity.getId()))")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", expression = "java(new com.fms.auth.domain.valueobject.Email(entity.getEmail()))")
    @Mapping(target = "password", expression = "java(new com.fms.auth.domain.valueobject.HashedPassword(entity.getPassword()))")
    @Mapping(target = "roles", expression = "java(entity.getRoles().stream().map(this::toRole).collect(java.util.stream.Collectors.toSet()))")
    User toDomain(UserJpaEntity entity);

    @Mapping(target = "id", source = "userId.value")
    @Mapping(target = "email", source = "email.value")
    @Mapping(target = "password", source = "password.hash")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(this::toJpaRole).collect(java.util.stream.Collectors.toSet()))")
    UserJpaEntity toJpaEntity(User user);

    default Role toRole(RoleJpaEntity entity) {
        return new Role(entity.getId(), entity.getName(), entity.getType());
    }

    default RoleJpaEntity toJpaRole(Role role) {
        RoleJpaEntity entity = new RoleJpaEntity();
        entity.setId(role.getId());
        entity.setName(role.getName());
        entity.setType(role.getType());
        return entity;
    }
}
