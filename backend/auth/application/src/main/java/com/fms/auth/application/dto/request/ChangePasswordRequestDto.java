package com.fms.auth.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record ChangePasswordRequestDto(
        UUID userId,
        @NotBlank String currentPassword,
        @NotBlank @Size(min = 8) String newPassword
) {}
