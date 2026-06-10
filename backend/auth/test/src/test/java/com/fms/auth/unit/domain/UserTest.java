package com.fms.auth.unit.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.fms.auth.domain.entity.User;
import com.fms.auth.domain.enums.UserStatus;
import com.fms.auth.domain.event.UserCreatedEvent;
import com.fms.auth.domain.valueobject.Email;
import com.fms.auth.domain.valueobject.HashedPassword;
import org.junit.jupiter.api.Test;

class UserTest {

    @Test
    void create_registersUserCreatedEvent() {
        User user = User.create(
                new Email("driver@fms.gov.et"),
                new HashedPassword("$2a$10$hash"),
                "Abebe",
                "Kebede",
                "+251911000000");

        assertThat(user.getStatus()).isEqualTo(UserStatus.ACTIVE);
        assertThat(user.pullDomainEvents()).hasSize(1).first().isInstanceOf(UserCreatedEvent.class);
    }

    @Test
    void lock_changesStatus() {
        User user = User.create(
                new Email("admin@fms.gov.et"),
                new HashedPassword("$2a$10$hash"),
                "Admin",
                "User",
                null);
        user.lock();
        assertThat(user.getStatus()).isEqualTo(UserStatus.LOCKED);
    }
}
