package com.fms.auth.domain.entity;

import com.fms.auth.domain.enums.UserStatus;
import com.fms.auth.domain.event.UserCreatedEvent;
import com.fms.auth.domain.valueobject.Email;
import com.fms.auth.domain.valueobject.HashedPassword;
import com.fms.auth.domain.valueobject.UserId;
import com.fms.common.domain.AggregateRoot;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;

@Getter
public class User extends AggregateRoot {
    private UserId userId;
    private Email email;
    private HashedPassword password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private UserStatus status;
    private Set<Role> roles;

    private User() {
        this.roles = new HashSet<>();
    }

    public static User create(Email email, HashedPassword password,
                              String firstName, String lastName, String phoneNumber) {
        User user = new User();
        user.userId = new UserId(UUID.randomUUID());
        user.setId(user.userId.value());
        user.email = email;
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName;
        user.phoneNumber = phoneNumber;
        user.status = UserStatus.ACTIVE;
        user.registerEvent(new UserCreatedEvent(user.userId, user.email));
        return user;
    }

    public void assignRole(Role role) {
        roles.add(role);
    }

    public void lock() {
        this.status = UserStatus.LOCKED;
    }

    public void activate() {
        this.status = UserStatus.ACTIVE;
    }

    public void changePassword(HashedPassword newPassword) {
        this.password = newPassword;
    }
}
