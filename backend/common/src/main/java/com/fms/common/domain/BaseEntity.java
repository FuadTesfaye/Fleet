package com.fms.common.domain;

import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class BaseEntity {
    private UUID id;
    private Instant createdAt;
    private Instant updatedAt;
}
