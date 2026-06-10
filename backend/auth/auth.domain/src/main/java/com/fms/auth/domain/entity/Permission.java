package com.fms.auth.domain.entity;

import java.util.UUID;
import lombok.Getter;

@Getter
public class Permission {
    private final UUID id;
    private final String name;
    private final String code;

    public Permission(UUID id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }
}
