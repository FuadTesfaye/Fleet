package com.fms.common.exception;

public class ConflictException extends FmsBaseException {
    public ConflictException(String message) {
        super("CONFLICT", message);
    }
}
