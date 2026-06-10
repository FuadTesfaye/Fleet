package com.fms.auth.application.port.output;

import com.fms.common.domain.DomainEvent;

public interface AuditEventPublisherPort {
    void publish(DomainEvent event);
}
