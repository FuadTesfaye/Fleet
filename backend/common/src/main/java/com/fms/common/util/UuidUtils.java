package com.fms.common.util;

import java.util.UUID;

public final class UuidUtils {
    private UuidUtils() {}

    public static UUID randomUuid() {
        return UUID.randomUUID();
    }

    public static UUID fromString(String value) {
        return UUID.fromString(value);
    }
}
