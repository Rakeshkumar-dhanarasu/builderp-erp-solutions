package com.pmsservice.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public final class DateUtils {

    public static String formatDateWithOrdinal(LocalDate date) {
    	if (date == null) {
            return "";
        }

        int day = date.getDayOfMonth();
        String month = date.format(DateTimeFormatter.ofPattern("MMMM"));
        int year = date.getYear();

        return month + " " + day + getOrdinalSuffix(day) + " " + year;
    }

    private static String getOrdinalSuffix(int day) {
        if (day >= 11 && day <= 13) {
            return "th";
        }

        return switch (day % 10) {
            case 1 -> "st";
            case 2 -> "nd";
            case 3 -> "rd";
            default -> "th";
        };
    }
}