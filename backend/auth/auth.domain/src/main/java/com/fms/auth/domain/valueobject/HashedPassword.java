package com.fms.auth.domain.valueobject;

public record HashedPassword(String hash) {
    public HashedPassword {
        if (hash == null || hash.isBlank()) {
            throw new IllegalArgumentException("Password hash cannot be blank");
        }
    }
}
