package com.fms.auth.application.command;

public record RegisterCommand(
        String email,
        String password,
        String firstName,
        String lastName,
        String phoneNumber
) {}
