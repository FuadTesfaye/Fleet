package com.fms.auth.application.service;

import com.fms.auth.application.command.ChangePasswordCommand;
import com.fms.auth.application.command.LoginCommand;
import com.fms.auth.application.command.RegisterCommand;
import com.fms.auth.application.dto.response.AuthResponseDto;
import com.fms.auth.application.dto.response.TokenResponseDto;
import com.fms.auth.application.dto.response.UserSummaryDto;
import com.fms.auth.application.mapper.AuthDtoMapper;
import com.fms.auth.application.port.input.AssignRoleUseCase;
import com.fms.auth.application.port.input.ChangePasswordUseCase;
import com.fms.auth.application.port.input.LoginUseCase;
import com.fms.auth.application.port.input.LogoutUseCase;
import com.fms.auth.application.port.input.RefreshTokenUseCase;
import com.fms.auth.application.port.input.RegisterUseCase;
import com.fms.auth.application.port.input.ValidateTokenUseCase;
import com.fms.auth.application.port.output.AuditEventPublisherPort;
import com.fms.auth.application.port.output.PasswordHashingPort;
import com.fms.auth.application.port.output.RolePersistencePort;
import com.fms.auth.application.port.output.TokenServicePort;
import com.fms.auth.application.port.output.UserPersistencePort;
import com.fms.auth.domain.entity.User;
import com.fms.auth.domain.enums.RoleType;
import com.fms.auth.domain.enums.UserStatus;
import com.fms.auth.domain.event.PasswordChangedEvent;
import com.fms.auth.domain.event.UserLoggedInEvent;
import com.fms.auth.domain.exception.InvalidCredentialsException;
import com.fms.auth.domain.exception.UserAlreadyExistsException;
import com.fms.auth.domain.exception.UserNotFoundException;
import com.fms.auth.domain.valueobject.Email;
import com.fms.auth.domain.valueobject.UserId;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthApplicationService implements LoginUseCase, RegisterUseCase, RefreshTokenUseCase,
        LogoutUseCase, ValidateTokenUseCase, AssignRoleUseCase, ChangePasswordUseCase {

    private final UserPersistencePort userPersistencePort;
    private final RolePersistencePort rolePersistencePort;
    private final TokenServicePort tokenServicePort;
    private final PasswordHashingPort passwordHashingPort;
    private final AuditEventPublisherPort auditEventPublisherPort;
    private final AuthDtoMapper authDtoMapper;

    @Override
    public AuthResponseDto login(LoginCommand command) {
        User user = userPersistencePort
                .findByEmail(new Email(command.email()))
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getStatus() == UserStatus.LOCKED) {
            throw new InvalidCredentialsException();
        }

        if (!passwordHashingPort.matches(command.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        TokenResponseDto tokens = tokenServicePort.generateTokens(user);
        auditEventPublisherPort.publish(new UserLoggedInEvent(user.getUserId(), user.getEmail()));
        return authDtoMapper.toAuthResponse(user, tokens);
    }

    @Override
    public UserSummaryDto register(RegisterCommand command) {
        Email email = new Email(command.email());
        if (userPersistencePort.existsByEmail(email)) {
            throw new UserAlreadyExistsException(command.email());
        }

        User user = User.create(
                email,
                passwordHashingPort.hash(command.password()),
                command.firstName(),
                command.lastName(),
                command.phoneNumber());
        User saved = userPersistencePort.save(user);
        user.pullDomainEvents().forEach(auditEventPublisherPort::publish);
        return authDtoMapper.toUserSummary(saved);
    }

    @Override
    public TokenResponseDto refresh(String refreshToken) {
        return tokenServicePort.refresh(refreshToken);
    }

    @Override
    public void logout(String refreshToken) {
        tokenServicePort.revoke(refreshToken);
    }

    @Override
    public boolean validate(String accessToken) {
        return tokenServicePort.validateAccessToken(accessToken);
    }

    @Override
    public UserSummaryDto assignRole(UUID userId, RoleType roleType) {
        User user = userPersistencePort.findById(new UserId(userId))
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));

        var role = rolePersistencePort.findByType(roleType)
                .orElseThrow(() -> new UserNotFoundException("Role: " + roleType));
        user.assignRole(role);
        return authDtoMapper.toUserSummary(userPersistencePort.save(user));
    }

    @Override
    public void changePassword(ChangePasswordCommand command) {
        User user = userPersistencePort.findById(new UserId(command.userId()))
                .orElseThrow(() -> new UserNotFoundException(command.userId().toString()));

        if (!passwordHashingPort.matches(command.currentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        user.changePassword(passwordHashingPort.hash(command.newPassword()));
        userPersistencePort.save(user);
        auditEventPublisherPort.publish(new PasswordChangedEvent(user.getUserId()));
    }
}
