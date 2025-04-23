package com.university.crud_basic.Exception;

public class DuplicateDataException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public DuplicateDataException(String message) {
        super(message);
    }
    
    public DuplicateDataException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("Ya existe un/a %s con %s: '%s'", resourceName, fieldName, fieldValue));
    }
}