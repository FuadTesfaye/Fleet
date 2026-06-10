package com.fms.common.exception;

public class DomainException extends FmsBaseException {
    public DomainException(String errorCode, String message) {
        super(errorCode, message);
    }
}
