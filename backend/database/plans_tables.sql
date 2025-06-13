CREATE TABLE IF NOT EXISTS ct_plans (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travel_type VARCHAR(50) NOT NULL,
    transportation_type VARCHAR(50) NOT NULL,
    travel_mode VARCHAR(50) NOT NULL,
    plan_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ct_plans_username ON ct_plans(username);
CREATE INDEX idx_ct_plans_location ON ct_plans(location);
