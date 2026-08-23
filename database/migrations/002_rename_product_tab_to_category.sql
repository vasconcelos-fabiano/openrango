ALTER TABLE produtos
CHANGE COLUMN aba categoria CHAR(1)
COMMENT 's=Saboritas; b=Bebidas; a=Bebidas alcoólicas; d=Sobremesas; v=Vícios; c=Conveniência';