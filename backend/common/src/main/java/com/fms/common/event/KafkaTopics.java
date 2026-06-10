package com.fms.common.event;

public interface KafkaTopics {
    String USER_CREATED = "fms.auth.user-created";
    String USER_LOGGED_IN = "fms.auth.user-logged-in";

    String EMPLOYEE_CREATED = "fms.user.employee-created";
    String DRIVER_ASSIGNED = "fms.user.driver-assigned";

    String VEHICLE_REGISTERED = "fms.vehicle.registered";
    String VEHICLE_STATUS = "fms.vehicle.status-changed";

    String GPS_TELEMETRY = "fms.tracking.telemetry";
    String GEOFENCE_BREACH = "fms.tracking.geofence-breach";
    String TRIP_STARTED = "fms.tracking.trip-started";
    String TRIP_ENDED = "fms.tracking.trip-ended";

    String DISPATCH_ASSIGNED = "fms.dispatch.assigned";
    String WORK_ORDER_CREATED = "fms.dispatch.work-order-created";

    String MAINTENANCE_SCHEDULED = "fms.maintenance.scheduled";
    String REPAIR_COMPLETED = "fms.maintenance.repair-completed";

    String FUEL_ALLOCATED = "fms.fuel.allocated";
    String FUEL_REFUELED = "fms.fuel.refueled";

    String NOTIFICATION_TRIGGER = "fms.notification.trigger";

    String AUDIT_EVENT = "fms.reporting.audit";
}
