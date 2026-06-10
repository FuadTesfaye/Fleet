package com.fms.auth.domain.entity;

import com.fms.auth.domain.enums.RoleType;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;

@Getter
public class Role {
    private final UUID id;
    private final String name;
    private final RoleType type;
    private final Set<Permission> permissions = new HashSet<>();

    public Role(UUID id, String name, RoleType type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public void addPermission(Permission permission) {
        permissions.add(permission);
    }
}
