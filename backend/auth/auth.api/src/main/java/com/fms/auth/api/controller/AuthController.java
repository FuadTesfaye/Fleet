package com.fms.auth.api.controller;

import com.fms.auth.application.dto.request.LoginRequestDto;
import com.fms.auth.application.dto.request.RegisterRequestDto;
import com.fms.auth.application.dto.response.AuthResponseDto;
import com.fms.auth.application.dto.response.TokenResponseDto;
import com.fms.auth.application.dto.response.UserSummaryDto;
import com.fms.auth.application.port.input.LoginUseCase;
import com.fms.auth.application.port.input.RefreshTokenUseCase;
import com.fms.auth.application.port.input.RegisterUseCase;
import com.fms.auth.api.mapper.AuthApiMapper;
import com.fms.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "JWT authentication and user registration")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final AuthApiMapper apiMapper;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT tokens")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successful login"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success(loginUseCase.login(apiMapper.toLoginCommand(request))));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<UserSummaryDto>> register(@Valid @RequestBody RegisterRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(registerUseCase.register(apiMapper.toRegisterCommand(request))));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<TokenResponseDto>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success(refreshTokenUseCase.refresh(request.refreshToken())));
    }

    public record RefreshTokenRequest(String refreshToken) {}
}
