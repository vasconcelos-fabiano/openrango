ALTER TABLE produtos
    ADD COLUMN gtin VARCHAR(14) NULL AFTER unidade;

CREATE TABLE inventory (
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id),
    CONSTRAINT fk_estoque_produto
        FOREIGN KEY (product_id) REFERENCES produtos(id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
