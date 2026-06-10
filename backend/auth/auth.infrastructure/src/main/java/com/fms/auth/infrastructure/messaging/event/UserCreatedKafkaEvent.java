package com.fms.auth.infrastructure.messaging.event;

import com.fms.common.event.BaseKafkaEvent;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class UserCreatedKafkaEvent extends BaseKafkaEvent {
    private UUID userId;
    private String email;
}
