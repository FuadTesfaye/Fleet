package com.fms.auth.application.dto.response;

import com.fms.auth.domain.enums.UserStatus;
import java.util.Set;
import java.util.UUID;

public record UserSummaryDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        UserStatus status,
        Set<String> roles
) {}
