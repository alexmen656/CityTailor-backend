CREATE TABLE IF NOT EXISTS ct_posts (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    caption TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ct_post_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES ct_posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_ct_posts_timestamp ON ct_posts(timestamp);
CREATE INDEX idx_ct_post_images_post_id ON ct_post_images(post_id);
