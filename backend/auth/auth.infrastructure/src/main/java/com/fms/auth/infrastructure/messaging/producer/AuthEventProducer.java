package com.fms.auth.infrastructure.messaging.producer;

import com.fms.auth.domain.event.UserCreatedEvent;
import com.fms.auth.domain.event.UserLoggedInEvent;
import com.fms.common.event.KafkaTopics;
import com.fms.auth.infrastructure.messaging.event.UserCreatedKafkaEvent;
import com.fms.auth.infrastructure.messaging.event.UserLoggedInKafkaEvent;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishUserCreated(UserCreatedEvent event) {
        UserCreatedKafkaEvent kafkaEvent = UserCreatedKafkaEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("UserCreated")
                .occurredOn(event.occurredOn())
                .correlationId(event.userId().value().toString())
                .userId(event.userId().value())
                .email(event.email().value())
                .build();
        kafkaTemplate.send(KafkaTopics.USER_CREATED, event.userId().value().toString(), kafkaEvent);
    }

    public void publishUserLoggedIn(UserLoggedInEvent event) {
        UserLoggedInKafkaEvent kafkaEvent = UserLoggedInKafkaEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("UserLoggedIn")
                .occurredOn(event.occurredOn())
                .correlationId(event.userId().value().toString())
                .userId(event.userId().value())
                .email(event.email().value())
                .build();
        kafkaTemplate.send(KafkaTopics.USER_LOGGED_IN, event.userId().value().toString(), kafkaEvent);
    }
}
