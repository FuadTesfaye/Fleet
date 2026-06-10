package com.fms.auth.api.mapper;

import com.fms.auth.application.command.LoginCommand;
import com.fms.auth.application.command.RegisterCommand;
import com.fms.auth.application.dto.request.LoginRequestDto;
import com.fms.auth.application.dto.request.RegisterRequestDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthApiMapper {
    LoginCommand toLoginCommand(LoginRequestDto request);

    RegisterCommand toRegisterCommand(RegisterRequestDto request);
}
