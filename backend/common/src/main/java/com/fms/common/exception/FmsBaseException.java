package com.fms.common.exception;

import lombok.Getter;

@Getter
public class FmsBaseException extends RuntimeException {
    private final String errorCode;

    public FmsBaseException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
