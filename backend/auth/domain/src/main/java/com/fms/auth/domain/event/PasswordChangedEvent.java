package com.fms.auth.domain.event;

import com.fms.auth.domain.valueobject.UserId;
import com.fms.common.domain.DomainEvent;
import java.time.Instant;

public record PasswordChangedEvent(UserId userId, Instant occurredOn) implements DomainEvent {
    public PasswordChangedEvent(UserId userId) {
        this(userId, Instant.now());
    }
}
