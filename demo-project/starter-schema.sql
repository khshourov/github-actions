CREATE DATABASE IF NOT EXISTS comments_db;

USE comments_db;

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT NOT NULL
);
