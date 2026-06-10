#!/usr/bin/env python3
"""Generate clean onion-architecture implementations for all FMS microservices."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


@dataclass
class EntitySpec:
    name: str
    table: str
    fields: list[tuple[str, str]]  # (javaType, fieldName)
    enum_fields: dict[str, list[str]] = field(default_factory=dict)


@dataclass
class ServiceSpec:
    name: str
    port: int
    base_path: str
    entities: list[EntitySpec]
    controllers: list[tuple[str, str, str]]  # (ControllerName, path, entityName)


SERVICES: list[ServiceSpec] = [
    ServiceSpec(
        "user", 8082, "employees",
        [
            EntitySpec("Organisation", "organisations", [
                ("UUID", "id"), ("String", "name"), ("String", "code"), ("String", "address"),
            ]),
            EntitySpec("Employee", "employees", [
                ("UUID", "id"), ("UUID", "organisationId"), ("String", "firstName"), ("String", "lastName"),
                ("String", "email"), ("String", "phone"), ("String", "status"),
            ], {"status": ["ACTIVE", "ON_LEAVE", "TERMINATED"]}),
            EntitySpec("Driver", "drivers", [
                ("UUID", "id"), ("UUID", "employeeId"), ("String", "licenseNumber"),
                ("java.time.LocalDate", "licenseExpiry"), ("String", "status"),
            ], {"status": ["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]}),
        ],
        [
            ("OrganisationController", "/api/v1/organisations", "Organisation"),
            ("EmployeeController", "/api/v1/employees", "Employee"),
            ("DriverController", "/api/v1/drivers", "Driver"),
        ],
    ),
    ServiceSpec(
        "vehicle", 8083, "vehicles",
        [
            EntitySpec("Vehicle", "vehicles", [
                ("UUID", "id"), ("String", "plateNumber"), ("String", "make"), ("String", "model"),
                ("int", "year"), ("String", "status"), ("String", "fuelType"),
            ], {"status": ["AVAILABLE", "IN_USE", "IN_MAINTENANCE", "DECOMMISSIONED", "OUT_OF_SERVICE"],
                "fuelType": ["DIESEL", "PETROL", "ELECTRIC", "HYBRID"]}),
        ],
        [("VehicleController", "/api/v1/vehicles", "Vehicle")],
    ),
    ServiceSpec(
        "tracking", 8084, "trips",
        [
            EntitySpec("Trip", "trips", [
                ("UUID", "id"), ("UUID", "vehicleId"), ("UUID", "driverId"), ("String", "origin"),
                ("String", "destination"), ("String", "status"),
            ], {"status": ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]}),
            EntitySpec("Geofence", "geofences", [
                ("UUID", "id"), ("String", "name"), ("String", "type"), ("String", "wkt"),
            ], {"type": ["ALLOWED_ZONE", "RESTRICTED_ZONE", "DEPOT", "CHECKPOINT"]}),
        ],
        [
            ("TripController", "/api/v1/trips", "Trip"),
            ("GeofenceController", "/api/v1/geofences", "Geofence"),
            ("TrackingController", "/api/v1/tracking", "Trip"),
        ],
    ),
    ServiceSpec(
        "dispatch", 8085, "work-orders",
        [
            EntitySpec("WorkOrder", "work_orders", [
                ("UUID", "id"), ("String", "title"), ("String", "description"), ("String", "status"),
                ("String", "priority"),
            ], {"status": ["DRAFT", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
                "priority": ["CRITICAL", "HIGH", "MEDIUM", "LOW"]}),
            EntitySpec("Dispatch", "dispatches", [
                ("UUID", "id"), ("UUID", "workOrderId"), ("UUID", "vehicleId"), ("UUID", "driverId"),
                ("String", "status"),
            ], {"status": ["PENDING", "ACTIVE", "EN_ROUTE", "COMPLETED", "FAILED"]}),
        ],
        [
            ("WorkOrderController", "/api/v1/work-orders", "WorkOrder"),
            ("DispatchController", "/api/v1/dispatches", "Dispatch"),
        ],
    ),
    ServiceSpec(
        "maintenance", 8086, "maintenance",
        [
            EntitySpec("MaintenanceRecord", "maintenance_records", [
                ("UUID", "id"), ("UUID", "vehicleId"), ("String", "type"), ("String", "status"),
                ("java.time.Instant", "scheduledAt"),
            ], {"type": ["PREVENTIVE", "CORRECTIVE", "EMERGENCY", "INSPECTION"],
                "status": ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "OVERDUE"]}),
            EntitySpec("RepairOrder", "repair_orders", [
                ("UUID", "id"), ("UUID", "maintenanceId"), ("String", "description"), ("String", "status"),
            ], {"status": ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]}),
        ],
        [("MaintenanceController", "/api/v1/maintenance", "MaintenanceRecord")],
    ),
    ServiceSpec(
        "fuel", 8087, "fuel",
        [
            EntitySpec("FuelRecord", "fuel_records", [
                ("UUID", "id"), ("UUID", "vehicleId"), ("java.math.BigDecimal", "litres"),
                ("java.math.BigDecimal", "cost"), ("java.time.Instant", "refueledAt"),
            ]),
            EntitySpec("FuelAllocation", "fuel_allocations", [
                ("UUID", "id"), ("UUID", "vehicleId"), ("java.math.BigDecimal", "budgetLitres"),
                ("java.time.LocalDate", "periodStart"), ("java.time.LocalDate", "periodEnd"),
            ]),
        ],
        [("FuelController", "/api/v1/fuel", "FuelRecord")],
    ),
    ServiceSpec(
        "notification", 8088, "notifications",
        [
            EntitySpec("Notification", "notifications", [
                ("UUID", "id"), ("String", "recipient"), ("String", "channel"), ("String", "status"),
                ("String", "message"),
            ], {"channel": ["EMAIL", "SMS", "PUSH"],
                "status": ["PENDING", "SENT", "FAILED", "RETRYING"]}),
        ],
        [("NotificationController", "/api/v1/notifications", "Notification")],
    ),
    ServiceSpec(
        "reporting", 8089, "reports",
        [
            EntitySpec("Report", "reports", [
                ("UUID", "id"), ("String", "type"), ("String", "format"), ("String", "status"),
            ], {"type": ["FLEET_UTILISATION", "FUEL_SUMMARY", "MAINTENANCE_SUMMARY", "DRIVER_PERFORMANCE", "TRIP_SUMMARY"],
                "format": ["PDF", "CSV", "EXCEL"],
                "status": ["QUEUED", "GENERATING", "READY", "FAILED"]}),
            EntitySpec("AuditLog", "audit_logs", [
                ("UUID", "id"), ("String", "eventType"), ("String", "actor"), ("String", "payload"),
                ("java.time.Instant", "occurredAt"),
            ]),
        ],
        [
            ("ReportController", "/api/v1/reports", "Report"),
            ("AuditController", "/api/v1/audit", "AuditLog"),
        ],
    ),
]


def pkg(svc: str) -> str:
    return f"com.fms.{svc}"


def module_path(svc: str, layer: str) -> Path:
    return ROOT / svc / f"{svc}.{layer}"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def gen_enum(svc: str, entity: EntitySpec, enum_name: str, values: list[str]) -> None:
    p = module_path(svc, "domain") / f"src/main/java/{pkg(svc).replace('.', '/')}/domain/enums/{enum_name}.java"
    body = ",\n    ".join(values)
    write(p, f"""package {pkg(svc)}.domain.enums;

public enum {enum_name} {{
    {body}
}}
""")


def gen_domain_entity(svc: str, entity: EntitySpec) -> None:
    p = module_path(svc, "domain") / f"src/main/java/{pkg(svc).replace('.', '/')}/domain/entity/{entity.name}.java"
    imports = {"import com.fms.common.domain.AggregateRoot;", "import java.util.UUID;"}
    for t, _ in entity.fields:
        if t.startswith("java."):
            imports.add(f"import {t};")
    if any(t == "UUID" for t, _ in entity.fields):
        pass
    fields_decl = []
    ctor_params = []
    ctor_assign = []
    getters_note = "@lombok.Getter"
    for t, name in entity.fields:
        if name == "id":
            continue
        enum_key = None
        for ek, ev in entity.enum_fields.items():
            if ek == name:
                enum_key = ek[0].upper() + ek[1:]
                imports.add(f"import {pkg(svc)}.domain.enums.{entity.name}{enum_key}Enum;")
                t = f"{entity.name}{enum_key}Enum"
        fields_decl.append(f"    private {t} {name};")
        ctor_params.append(f"{t} {name}")
        ctor_assign.append(f"        e.{name} = {name};")

    id_field = "    private UUID id;\n"
    write(p, f"""package {pkg(svc)}.domain.entity;

{chr(10).join(sorted(imports))}
import lombok.Getter;

@Getter
public class {entity.name} extends AggregateRoot {{
{id_field}{chr(10).join(fields_decl)}

    private {entity.name}() {{}}

    public static {entity.name} create({", ".join(ctor_params)}) {{
        {entity.name} e = new {entity.name}();
        e.id = UUID.randomUUID();
        e.setId(e.id);
{chr(10).join(ctor_assign)}
        return e;
    }}

    public static {entity.name} reconstitute(UUID id, {", ".join(ctor_params)}) {{
        {entity.name} e = new {entity.name}();
        e.id = id;
        e.setId(id);
{chr(10).join(ctor_assign)}
        return e;
    }}
}}
""")

    # enums
    for ename, values in entity.enum_fields.items():
        enum_class = f"{entity.name}{ename[0].upper() + ename[1:]}Enum"
        gen_enum(svc, entity, enum_class, values)

    # repository
    rp = module_path(svc, "domain") / f"src/main/java/{pkg(svc).replace('.', '/')}/domain/repository/{entity.name}Repository.java"
    write(rp, f"""package {pkg(svc)}.domain.repository;

import {pkg(svc)}.domain.entity.{entity.name};
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface {entity.name}Repository {{
    {entity.name} save({entity.name} entity);
    Optional<{entity.name}> findById(UUID id);
    List<{entity.name}> findAll();
    void deleteById(UUID id);
}}
""")


def gen_application_layer(svc: str, entity: EntitySpec) -> None:
    base = module_path(svc, "application") / f"src/main/java/{pkg(svc).replace('.', '/')}/application"
    dto_name = f"{entity.name}Dto"
    write(base / f"dto/{dto_name}.java", f"""package {pkg(svc)}.application.dto;

import java.util.UUID;
import lombok.Builder;

@Builder
public record {dto_name}(
        UUID id,
{",".join(chr(10) + f"        {t} {n}" for t, n in entity.fields if n != "id")}
) {{}}
""")

    write(base / f"port/input/Create{entity.name}UseCase.java", f"""package {pkg(svc)}.application.port.input;

import {pkg(svc)}.application.dto.{dto_name};

public interface Create{entity.name}UseCase {{
    {dto_name} create({dto_name} request);
}}
""")

    write(base / f"port/input/Get{entity.name}UseCase.java", f"""package {pkg(svc)}.application.port.input;

import {pkg(svc)}.application.dto.{dto_name};
import java.util.List;
import java.util.UUID;

public interface Get{entity.name}UseCase {{
    {dto_name} getById(UUID id);
    List<{dto_name}> listAll();
}}
""")

    write(base / f"port/output/{entity.name}PersistencePort.java", f"""package {pkg(svc)}.application.port.output;

import {pkg(svc)}.domain.entity.{entity.name};
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface {entity.name}PersistencePort {{
    {entity.name} save({entity.name} entity);
    Optional<{entity.name}> findById(UUID id);
    List<{entity.name}> findAll();
    void deleteById(UUID id);
}}
""")

    # mapper
    write(base / f"mapper/{entity.name}Mapper.java", f"""package {pkg(svc)}.application.mapper;

import {pkg(svc)}.application.dto.{dto_name};
import {pkg(svc)}.domain.entity.{entity.name};
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface {entity.name}Mapper {{
    @Mapping(target = "id", source = "id")
    {dto_name} toDto({entity.name} entity);
}}
""")

    # service - only for first entity per service to avoid duplicate class names
    pass


def gen_application_service(svc: str, entity: EntitySpec) -> None:
    base = module_path(svc, "application") / f"src/main/java/{pkg(svc).replace('.', '/')}/application/service"
    dto_name = f"{entity.name}Dto"
    create_params = []
    create_assign = []
    reconst_params = []
    for t, name in entity.fields:
        if name == "id":
            continue
        enum_type = None
        for ek in entity.enum_fields:
            if ek == name:
                enum_type = f"{entity.name}{ek[0].upper() + ek[1:]}Enum"
        java_t = enum_type or t
        create_params.append(f"{java_t} {name}")
        create_assign.append(f"request.{name}()")
        reconst_params.append(f"request.{name}()")

    write(base / f"{entity.name}ApplicationService.java", f"""package {pkg(svc)}.application.service;

import {pkg(svc)}.application.dto.{dto_name};
import {pkg(svc)}.application.mapper.{entity.name}Mapper;
import {pkg(svc)}.application.port.input.Create{entity.name}UseCase;
import {pkg(svc)}.application.port.input.Get{entity.name}UseCase;
import {pkg(svc)}.application.port.output.{entity.name}PersistencePort;
import {pkg(svc)}.domain.entity.{entity.name};
import com.fms.common.exception.ResourceNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class {entity.name}ApplicationService implements Create{entity.name}UseCase, Get{entity.name}UseCase {{

    private final {entity.name}PersistencePort persistencePort;
    private final {entity.name}Mapper mapper;

    @Override
    public {dto_name} create({dto_name} request) {{
        {entity.name} entity = {entity.name}.create({", ".join(create_assign)});
        return mapper.toDto(persistencePort.save(entity));
    }}

    @Override
    public {dto_name} getById(UUID id) {{
        return persistencePort.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("{entity.name} not found: " + id));
    }}

    @Override
    public List<{dto_name}> listAll() {{
        return persistencePort.findAll().stream().map(mapper::toDto).toList();
    }}
}}
""")


def gen_infrastructure(svc: str, entity: EntitySpec) -> None:
    jpa = module_path(svc, "infrastructure") / f"src/main/java/{pkg(svc).replace('.', '/')}/infrastructure/persistence"
    cols = []
    jpa_fields = []
    for t, name in entity.fields:
        col = name.replaceAll if False else name  # noqa
        if t == "UUID":
            jpa_fields.append(f"    @Id\n    private UUID {name};")
        elif "Enum" in t or name in entity.enum_fields:
            ename = entity.enum_fields.get(name, [])
            enum_class = f"{entity.name}{name[0].upper() + name[1:]}Enum" if name in entity.enum_fields else t
            jpa_fields.append(f"    @Enumerated(EnumType.STRING)\n    private {enum_class} {name};")
        else:
            ann = ""
            if name in ("email", "plateNumber", "code", "name"):
                ann = "    @Column(nullable = false)\n"
            jpa_fields.append(f"{ann}    private {t.replace('java.time.', '')} {name};")

    enum_imports = ""
    for ename in entity.enum_fields:
        enum_imports += f"import {pkg(svc)}.domain.enums.{entity.name}{ename[0].upper() + ename[1:]}Enum;\n"

    write(jpa / f"entity/{entity.name}JpaEntity.java", f"""package {pkg(svc)}.infrastructure.persistence.entity;

{enum_imports}import jakarta.persistence.*;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "{entity.table}")
@Getter
@Setter
@NoArgsConstructor
public class {entity.name}JpaEntity {{
{chr(10).join(jpa_fields)}
}}
""")

    write(jpa / f"repository/{entity.name}JpaRepository.java", f"""package {pkg(svc)}.infrastructure.persistence.repository;

import {pkg(svc)}.infrastructure.persistence.entity.{entity.name}JpaEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface {entity.name}JpaRepository extends JpaRepository<{entity.name}JpaEntity, UUID> {{
}}
""")

    # persistence mapper
    reconst_args = ", ".join(f"entity.get{ n[0].upper()+n[1:] }()" for _, n in entity.fields if n != "id" or True)
    reconst_args_list = ["entity.getId()"]
    for t, name in entity.fields:
        if name == "id":
            continue
        reconst_args_list.append(f"entity.get{name[0].upper() + name[1:]}()")

    write(jpa / f"mapper/{entity.name}PersistenceMapper.java", f"""package {pkg(svc)}.infrastructure.persistence.mapper;

import {pkg(svc)}.domain.entity.{entity.name};
import {pkg(svc)}.infrastructure.persistence.entity.{entity.name}JpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface {entity.name}PersistenceMapper {{

    default {entity.name} toDomain({entity.name}JpaEntity entity) {{
        return {entity.name}.reconstitute({", ".join(reconst_args_list)});
    }}

    @Mapping(target = "id", source = "id")
    {entity.name}JpaEntity toJpa({entity.name} domain);
}}
""")

    write(jpa / f"adapter/{entity.name}PersistenceAdapter.java", f"""package {pkg(svc)}.infrastructure.persistence.adapter;

import {pkg(svc)}.application.port.output.{entity.name}PersistencePort;
import {pkg(svc)}.domain.entity.{entity.name};
import {pkg(svc)}.infrastructure.persistence.mapper.{entity.name}PersistenceMapper;
import {pkg(svc)}.infrastructure.persistence.repository.{entity.name}JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class {entity.name}PersistenceAdapter implements {entity.name}PersistencePort {{

    private final {entity.name}JpaRepository repository;
    private final {entity.name}PersistenceMapper mapper;

    @Override
    public {entity.name} save({entity.name} entity) {{
        return mapper.toDomain(repository.save(mapper.toJpa(entity)));
    }}

    @Override
    public Optional<{entity.name}> findById(UUID id) {{
        return repository.findById(id).map(mapper::toDomain);
    }}

    @Override
    public List<{entity.name}> findAll() {{
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }}

    @Override
    public void deleteById(UUID id) {{
        repository.deleteById(id);
    }}
}}
""")

    # flyway - only first migration file per entity
    mig = module_path(svc, "infrastructure") / f"src/main/resources/db/migration"
    mig.mkdir(parents=True, exist_ok=True)
    sql_cols = []
    for t, name in entity.fields:
        sql_type = "UUID PRIMARY KEY" if name == "id" else (
            "VARCHAR(50)" if name in entity.enum_fields or t == "String" else
            "TIMESTAMPTZ" if "Instant" in t else
            "DATE" if "LocalDate" in t else
            "NUMERIC(12,2)" if "BigDecimal" in t else
            "INTEGER" if t == "int" else "VARCHAR(255)"
        )
        if name == "id":
            sql_cols.append(f"    {name} {sql_type}")
        else:
            sql_cols.append(f"    {name} {sql_type}")

    idx = entity.name
    version = list(svc_entities_index(svc, entity))
    vnum = version + 1
    write(mig / f"V{vnum}__create_{entity.table}.sql", f"""CREATE TABLE IF NOT EXISTS {entity.table} (
{",".join(chr(10) + c for c in sql_cols)}
);
""")


def svc_entities_index(svc_name: str, current: EntitySpec):
    for spec in SERVICES:
        if spec.name == svc_name:
            for i, e in enumerate(spec.entities):
                if e.name == current.name:
                    yield i


def gen_api_controller(svc: str, ctrl_name: str, path: str, entity: EntitySpec) -> None:
    dto = f"{entity.name}Dto"
    api = module_path(svc, "api") / f"src/main/java/{pkg(svc).replace('.', '/')}/api"
    tag = entity.name + "s"
    write(api / f"controller/{ctrl_name}.java", f"""package {pkg(svc)}.api.controller;

import {pkg(svc)}.application.dto.{dto};
import {pkg(svc)}.application.port.input.Create{entity.name}UseCase;
import {pkg(svc)}.application.port.input.Get{entity.name}UseCase;
import com.fms.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("{path}")
@RequiredArgsConstructor
@Tag(name = "{tag}")
public class {ctrl_name} {{

    private final Create{entity.name}UseCase createUseCase;
    private final Get{entity.name}UseCase getUseCase;

    @PostMapping
    @Operation(summary = "Create {entity.name}")
    public ResponseEntity<ApiResponse<{dto}>> create(@Valid @RequestBody {dto} request) {{
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createUseCase.create(request)));
    }}

    @GetMapping("/{{id}}")
    @Operation(summary = "Get {entity.name} by id")
    public ResponseEntity<ApiResponse<{dto}>> getById(@PathVariable UUID id) {{
        return ResponseEntity.ok(ApiResponse.success(getUseCase.getById(id)));
    }}

    @GetMapping
    @Operation(summary = "List {entity.name}s")
    public ResponseEntity<ApiResponse<List<{dto}>>> list() {{
        return ResponseEntity.ok(ApiResponse.success(getUseCase.listAll()));
    }}
}}
""")


def gen_api_shared(svc: str, port: int) -> None:
    api = module_path(svc, "api") / f"src/main/java/{pkg(svc).replace('.', '/')}/api"
    resources = module_path(svc, "api") / "src/main/resources"

    write(api / f"{svc.title().replace(' ', '')}ServiceApplication.java" if False else api.parent / f"{svc.title()}ServiceApplication.java", "")

    # Main class in api package root
    main = module_path(svc, "api") / f"src/main/java/{pkg(svc).replace('.', '/')}/api/{svc.title()}ServiceApplication.java"
    if svc == "user":
        class_name = "UserServiceApplication"
    elif svc == "vehicle":
        class_name = "VehicleServiceApplication"
    elif svc == "tracking":
        class_name = "TrackingServiceApplication"
    elif svc == "dispatch":
        class_name = "DispatchServiceApplication"
    elif svc == "maintenance":
        class_name = "MaintenanceServiceApplication"
    elif svc == "fuel":
        class_name = "FuelServiceApplication"
    elif svc == "notification":
        class_name = "NotificationServiceApplication"
    else:
        class_name = "ReportingServiceApplication"

    write(main, f"""package {pkg(svc)}.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "{pkg(svc)}")
public class {class_name} {{
    public static void main(String[] args) {{
        SpringApplication.run({class_name}.class, args);
    }}
}}
""")

    write(api / "advice/GlobalExceptionHandler.java", f"""package {pkg(svc)}.api.advice;

import com.fms.common.exception.ConflictException;
import com.fms.common.exception.ResourceNotFoundException;
import com.fms.common.response.ApiResponse;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {{

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {{
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("NOT_FOUND", ex.getMessage()));
    }}

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(ConflictException ex) {{
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("CONFLICT", ex.getMessage()));
    }}

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {{
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
        return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
    }}

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {{
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("INTERNAL_ERROR", "An unexpected error occurred"));
    }}
}}
""")

    write(api / "config/SwaggerConfig.java", f"""package {pkg(svc)}.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {{
    @Value("${{spring.application.name}}")
    private String appName;

    @Bean
    public OpenAPI openAPI() {{
        return new OpenAPI()
                .info(new Info().title("FMS — " + appName).version("v1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }}

    @Bean
    public GroupedOpenApi publicApi() {{
        return GroupedOpenApi.builder().group("public").pathsToMatch("/api/v1/**").build();
    }}
}}
""")

    write(api / "config/WebConfig.java", f"""package {pkg(svc)}.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {{
    @Override
    public void addCorsMappings(CorsRegistry registry) {{
        registry.addMapping("/api/**").allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    }}
}}
""")

    write(resources / "application.yml", f"""spring:
  application:
    name: {svc}-service
  datasource:
    url: jdbc:postgresql://${{DB_HOST:localhost}}:5432/fms_{svc}
    username: ${{DB_USER:fms}}
    password: ${{DB_PASS:fms}}
  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
    locations: classpath:db/migration
  data:
    redis:
      host: ${{REDIS_HOST:localhost}}
      port: 6379
  kafka:
    bootstrap-servers: ${{KAFKA_BOOTSTRAP:localhost:9092}}
    consumer:
      group-id: fms-{svc}-group
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${{KEYCLOAK_URL:http://localhost:8180}}/realms/fms
server:
  port: ${{{'PORT:' + str(port)}}}
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
""")


def gen_infrastructure_config(svc: str) -> None:
    infra = module_path(svc, "infrastructure") / f"src/main/java/{pkg(svc).replace('.', '/')}/infrastructure/config"
    write(infra / "JpaConfig.java", f"""package {pkg(svc)}.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "{pkg(svc)}.infrastructure.persistence.repository")
@EntityScan(basePackages = "{pkg(svc)}.infrastructure.persistence.entity")
public class JpaConfig {{}}
""")

    write(infra / "KafkaProducerConfig.java", f"""package {pkg(svc)}.infrastructure.config;

import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

@Configuration
public class KafkaProducerConfig {{
    @Value("${{spring.kafka.bootstrap-servers}}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {{
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }}

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {{
        return new KafkaTemplate<>(producerFactory());
    }}
}}
""")


def cleanup_old_files(svc: str) -> None:
    """Remove placeholder package-info and misplaced main classes."""
    for rel in [
        f"{svc}.domain/src/main/java/{pkg(svc).replace('.', '/')}/domain/package-info.java",
        f"{svc}.application/src/main/java/{pkg(svc).replace('.', '/')}/application/package-info.java",
        f"{svc}.api/src/main/java/{pkg(svc).replace('.', '/')}/{svc.title()}ServiceApplication.java",
        f"{svc}.api/src/main/java/com/fms/{svc}/UserServiceApplication.java",
    ]:
        p = ROOT / svc / rel.split("/", 1)[-1] if "/" in rel else ROOT / rel
        # fix path
    old_main = list((ROOT / svc / f"{svc}.api" / "src/main/java").rglob(f"*{svc.title()}ServiceApplication.java"))
    for p in old_main:
        if "/api/" not in str(p):
            p.unlink(missing_ok=True)


def generate_service(spec: ServiceSpec) -> None:
    for entity in spec.entities:
        gen_domain_entity(spec.name, entity)
        gen_application_layer(spec.name, entity)
        gen_application_service(spec.name, entity)
        gen_infrastructure(spec.name, entity)

    for ctrl, path, entity_name in spec.controllers:
        entity = next(e for e in spec.entities if e.name == entity_name)
        gen_api_controller(spec.name, ctrl, path, entity)

    gen_api_shared(spec.name, spec.port)
    gen_infrastructure_config(spec.name)

    # docker profile
    docker_yml = module_path(spec.name, "api") / "src/main/resources/application-docker.yml"
    write(docker_yml, f"""spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/fms_{spec.name}
  data:
    redis:
      host: redis
  kafka:
    bootstrap-servers: kafka:29092
  jpa:
    hibernate:
      ddl-auto: validate
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration
server:
  port: {spec.port}
""")

    # security config
    sec = module_path(spec.name, "api") / f"src/main/java/{pkg(spec.name).replace('.', '/')}/api/config/SecurityConfig.java"
    write(sec, f"""package {pkg(spec.name)}.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {{

    @Bean
    @Profile("docker")
    public SecurityFilterChain dockerChain(HttpSecurity http) throws Exception {{
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a.anyRequest().permitAll());
        return http.build();
    }}

    @Bean
    @Profile("!docker")
    public SecurityFilterChain defaultChain(HttpSecurity http) throws Exception {{
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/actuator/**", "/swagger-ui/**", "/api-docs/**", "/v3/api-docs/**")
                        .permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(j -> {{}}));
        return http.build();
    }}
}}
""")


def main():
    for spec in SERVICES:
        print(f"Generating {spec.name}...")
        generate_service(spec)
    print("Done. Run: mvn clean compile")


if __name__ == "__main__":
    main()
