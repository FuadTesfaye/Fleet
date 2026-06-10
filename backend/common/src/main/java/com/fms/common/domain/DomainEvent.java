package com.fms.common.domain;

import java.time.Instant;

public interface DomainEvent {
    Instant occurredOn();
}
