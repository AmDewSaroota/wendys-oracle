-- Migration 020: Replace MOCK device IDs with real Tuya device IDs
-- Mapping: ES-XX → MT13W sensor → real tuya_device_id

-- === registered_sensors ===
UPDATE registered_sensors SET tuya_device_id = 'a3d01864e463e3ede0hf0e' WHERE tuya_device_id = 'MOCK-ES-01'; -- MT13W 1
UPDATE registered_sensors SET tuya_device_id = 'a3f9c351b1a172a67e7mtv' WHERE tuya_device_id = 'MOCK-ES-02'; -- MT13W 2
UPDATE registered_sensors SET tuya_device_id = 'a3fb7dd9906bdfb311ecus' WHERE tuya_device_id = 'MOCK-ES-03'; -- MT13W (no number)
UPDATE registered_sensors SET tuya_device_id = 'a34fa363efe0546f12mwpm' WHERE tuya_device_id = 'MOCK-ES-04'; -- MT13W 4
UPDATE registered_sensors SET tuya_device_id = 'a33307bdb406717069gl7z' WHERE tuya_device_id = 'MOCK-ES-05'; -- MT13W 5
UPDATE registered_sensors SET tuya_device_id = 'a373ac96f2821fc7ce7xnc' WHERE tuya_device_id = 'MOCK-ES-06'; -- MT13W 6
UPDATE registered_sensors SET tuya_device_id = 'a36b74a661f54af81bmdqy' WHERE tuya_device_id = 'MOCK-ES-07'; -- MT13W 7
UPDATE registered_sensors SET tuya_device_id = 'a38d2927decbfa80c9ozdg' WHERE tuya_device_id = 'MOCK-ES-08'; -- MT13W 8
UPDATE registered_sensors SET tuya_device_id = 'a32a6312437b42498fzgaq' WHERE tuya_device_id = 'MOCK-ES-09'; -- MT13W 9
UPDATE registered_sensors SET tuya_device_id = 'a33544899b9065898cyavj' WHERE tuya_device_id = 'MOCK-ES-10'; -- MT13W 11

-- === devices (house assignments) ===
UPDATE devices SET tuya_device_id = 'a3d01864e463e3ede0hf0e' WHERE tuya_device_id = 'MOCK-ES-01';
UPDATE devices SET tuya_device_id = 'a3f9c351b1a172a67e7mtv' WHERE tuya_device_id = 'MOCK-ES-02';
UPDATE devices SET tuya_device_id = 'a3fb7dd9906bdfb311ecus' WHERE tuya_device_id = 'MOCK-ES-03';
UPDATE devices SET tuya_device_id = 'a34fa363efe0546f12mwpm' WHERE tuya_device_id = 'MOCK-ES-04';
UPDATE devices SET tuya_device_id = 'a33307bdb406717069gl7z' WHERE tuya_device_id = 'MOCK-ES-05';
UPDATE devices SET tuya_device_id = 'a373ac96f2821fc7ce7xnc' WHERE tuya_device_id = 'MOCK-ES-06';
UPDATE devices SET tuya_device_id = 'a36b74a661f54af81bmdqy' WHERE tuya_device_id = 'MOCK-ES-07';
UPDATE devices SET tuya_device_id = 'a38d2927decbfa80c9ozdg' WHERE tuya_device_id = 'MOCK-ES-08';
UPDATE devices SET tuya_device_id = 'a32a6312437b42498fzgaq' WHERE tuya_device_id = 'MOCK-ES-09';
UPDATE devices SET tuya_device_id = 'a33544899b9065898cyavj' WHERE tuya_device_id = 'MOCK-ES-10';
