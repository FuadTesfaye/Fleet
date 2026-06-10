package com.fms.auth.application.mapper;

import com.fms.auth.application.dto.response.AuthResponseDto;
import com.fms.auth.application.dto.response.TokenResponseDto;
import com.fms.auth.application.dto.response.UserSummaryDto;
import com.fms.auth.domain.entity.Role;
import com.fms.auth.domain.entity.User;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthDtoMapper {

    @Mapping(target = "id", source = "user.userId.value")
    @Mapping(target = "email", source = "user.email.value")
    @Mapping(target = "roles", expression = "java(mapRoles(user))")
    UserSummaryDto toUserSummary(User user);

    default AuthResponseDto toAuthResponse(User user, TokenResponseDto tokens) {
        return new AuthResponseDto(toUserSummary(user), tokens);
    }

    default java.util.Set<String> mapRoles(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}
