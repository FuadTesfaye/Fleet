package com.fms.common.exception;

public class ResourceNotFoundException extends FmsBaseException {
    public ResourceNotFoundException(String message) {
        super("NOT_FOUND", message);
    }
}
