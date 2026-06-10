package com.fms.common.exception;

public class ValidationException extends FmsBaseException {
    public ValidationException(String message) {
        super("VALIDATION_ERROR", message);
    }
}
