package com.fms.common.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

public final class DateUtils {
    private static final ZoneId ETHIOPIA_ZONE = ZoneId.of("Africa/Addis_Ababa");

    private DateUtils() {}

    public static LocalDate toEthiopianLocalDate(Instant instant) {
        return instant.atZone(ETHIOPIA_ZONE).toLocalDate();
    }

    public static Instant startOfDayEthiopia(LocalDate date) {
        return date.atStartOfDay(ETHIOPIA_ZONE).toInstant();
    }
}
