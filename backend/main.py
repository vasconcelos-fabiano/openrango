from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pymysql

def get_connection():
    return pymysql.connect(
        host="mysql",
        user="openrango",
        password="openrango_dev",
        database="openrango",
        cursorclass=pymysql.cursors.DictCursor,
    )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:4200",
    "http://192.168.18.9:4200",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/produtos")
def produtos():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
            SELECT id, nome, tamanho, unidade, categoria, preco_venda
            FROM produtos
            WHERE ativa = 1
            ORDER BY nome, tamanho
            """)
            return cursor.fetchall()
    finally:
        connection.close()


@app.get("/pedidos/proximo-numero")
def proximo_numero_pedido():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT ultimo_numero + 1 AS proximo_numero
                FROM controle_pedidos
                WHERE id = 1
            """)
            resultado = cursor.fetchone()

        return {"proximo_numero": resultado["proximo_numero"]}
    finally:
        connection.close()

@app.get("/")
def root():
    return {"message": "OpenRango API"}
