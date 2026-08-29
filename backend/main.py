from fastapi import FastAPI
import pymysql

connection = pymysql.connect(
    host="mysql",
    user="openrango",
    password="openrango_dev",
    database="openrango",
    cursorclass=pymysql.cursors.DictCursor,
)

app = FastAPI()


@app.get("/produtos")
def produtos():
    with connection.cursor() as cursor:
        cursor.execute("""
    SELECT id, nome, tamanho, unidade, categoria, preco_venda
    FROM produtos
    WHERE ativa = 1
    ORDER BY nome, tamanho
""")
        return cursor.fetchall()


@app.get("/")
def root():
    return {"message": "OpenRango API"}
