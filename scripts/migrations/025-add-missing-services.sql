-- Add missing InStyle services
-- Tenant ID: ccb12b4d-ade6-467d-a614-7c9d198ddc70

INSERT INTO services (id, tenant_id, name, description, price, duration_minutes, is_active, created_at, updated_at)
VALUES 
    (
        lower(hex(randomblob(16))), 
        'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 
        'Soft Glam Makeup', 
        'Professional soft glam makeup application', 
        45000, 
        120, 
        1, 
        strftime('%s', 'now'), 
        strftime('%s', 'now')
    ),
    (
        lower(hex(randomblob(16))), 
        'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 
        'Gel Maphondo Styling', 
        'Expert gel maphondo styling and shaping', 
        35000, 
        120, 
        1, 
        strftime('%s', 'now'), 
        strftime('%s', 'now')
    ),
    (
        lower(hex(randomblob(16))), 
        'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 
        'Frontal Ponytail Installation', 
        'Premium frontal ponytail installation service', 
        95000, 
        120, 
        1, 
        strftime('%s', 'now'), 
        strftime('%s', 'now')
    );
