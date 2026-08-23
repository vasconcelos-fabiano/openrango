ALTER TABLE clientes
ADD COLUMN aniversario_dia TINYINT UNSIGNED NULL AFTER cpf,
ADD COLUMN aniversario_mes TINYINT UNSIGNED NULL AFTER aniversario_dia;