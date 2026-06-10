package com.fms.auth.application.port.input;

import com.fms.auth.application.dto.response.UserSummaryDto;
import com.fms.auth.domain.enums.RoleType;
import java.util.UUID;

public interface AssignRoleUseCase {
    UserSummaryDto assignRole(UUID userId, RoleType roleType);
}
