package com.fms.auth.api.controller;

import com.fms.auth.application.dto.response.UserSummaryDto;
import com.fms.auth.application.port.input.AssignRoleUseCase;
import com.fms.auth.domain.enums.RoleType;
import com.fms.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(name = "Roles", description = "Role assignment")
public class RoleController {

    private final AssignRoleUseCase assignRoleUseCase;

    @PostMapping("/users/{userId}/assign")
    @Operation(summary = "Assign a role to a user")
    public ResponseEntity<ApiResponse<UserSummaryDto>> assignRole(
            @PathVariable UUID userId,
            @RequestParam RoleType roleType) {
        return ResponseEntity.ok(ApiResponse.success(assignRoleUseCase.assignRole(userId, roleType)));
    }
}
