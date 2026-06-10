-- Demo user: admin@fms.gov.et / password123
INSERT INTO users (id, email, password, first_name, last_name, status)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'admin@fms.gov.et',
    '$2a$10$VBjjuCkOUxxEf1MbieXbAOKTvsvcZYdoVh7nBIuCCusMeeKMZ73OC',
    'System',
    'Administrator',
    'ACTIVE'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT DO NOTHING;
