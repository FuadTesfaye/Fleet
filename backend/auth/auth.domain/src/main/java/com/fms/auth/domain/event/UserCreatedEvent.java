package com.fms.auth.domain.event;

import com.fms.auth.domain.valueobject.Email;
import com.fms.auth.domain.valueobject.UserId;
import com.fms.common.domain.DomainEvent;
import java.time.Instant;

public record UserCreatedEvent(UserId userId, Email email, Instant occurredOn) implements DomainEvent {
    public UserCreatedEvent(UserId userId, Email email) {
        this(userId, email, Instant.now());
    }
}
