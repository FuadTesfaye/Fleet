package com.fms.auth.infrastructure.messaging;

import com.fms.auth.application.port.output.AuditEventPublisherPort;
import com.fms.auth.domain.event.UserCreatedEvent;
import com.fms.auth.domain.event.UserLoggedInEvent;
import com.fms.auth.infrastructure.messaging.producer.AuthEventProducer;
import com.fms.common.domain.DomainEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditEventPublisherAdapter implements AuditEventPublisherPort {

    private final AuthEventProducer authEventProducer;

    @Override
    public void publish(DomainEvent event) {
        switch (event) {
            case UserCreatedEvent e -> authEventProducer.publishUserCreated(e);
            case UserLoggedInEvent e -> authEventProducer.publishUserLoggedIn(e);
            default -> { /* other events logged internally */ }
        }
    }
}
