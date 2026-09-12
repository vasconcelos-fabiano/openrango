from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pymysql
from datetime import datetime
from zoneinfo import ZoneInfo
import ntplib
import json
from urllib.request import urlopen

PIX_CONFIG_URL = "https://openrango.fabianovasconcelos.com/config/pix.json"


def get_pix_config():
    with urlopen(PIX_CONFIG_URL, timeout=5) as response:
        return json.load(response)


def pix_field(field_id: str, value: str) -> str:
    return f"{field_id}{len(value):02d}{value}"


def pix_crc16(payload: str) -> str:
    crc = 0xFFFF

    for byte in payload.encode("utf-8"):
        crc ^= byte << 8

        for _ in range(8):
            if crc & 0x8000:
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF
            else:
                crc = (crc << 1) & 0xFFFF

    return f"{crc:04X}"


def generate_pix_payload(amount: float) -> str:
    config = get_pix_config()

    merchant_account = pix_field("00", "br.gov.bcb.pix") + pix_field(
        "01", config["pix_key"]
    )

    additional_data = pix_field("05", "***")

    payload = (
        pix_field("00", "01")
        + pix_field("26", merchant_account)
        + pix_field("52", "0000")
        + pix_field("53", "986")
        + pix_field("54", f"{amount:.2f}")
        + pix_field("58", "BR")
        + pix_field("59", config["merchant_name"])
        + pix_field("60", config["merchant_city"])
        + pix_field("62", additional_data)
        + "6304"
    )

    return payload + pix_crc16(payload)


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
        "http://100.71.125.85:4200",
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


@app.get("/config/pix")
def pix_config():
    return get_pix_config()


@app.get("/pix")
def pix(amount: float):
    return {
        "amount": amount,
        "payload": generate_pix_payload(amount),
    }


@app.get("/horario")
def horario():
    servidores = [
        ("time.nist.gov", "NIST"),
        ("ntp1.npl.co.uk", "NPL"),
    ]

    client = ntplib.NTPClient()

    for servidor, fonte in servidores:
        try:
            response = client.request(servidor, version=3, timeout=5)

            now = datetime.fromtimestamp(
                response.tx_time,
                tz=ZoneInfo("America/Fortaleza"),
            )

            return {
                "datetime": now.isoformat(),
                "source": fonte,
            }
        except Exception:
            continue

    now = datetime.now(ZoneInfo("America/Fortaleza"))

    return {
        "datetime": now.isoformat(),
        "source": "local",
        "warning": (
            "Não foi possível obter a data e a hora dos nossos dois servidores remotos. "
            "O OpenRango está utilizando a data e a hora deste computador. "
            "É muito importante verificar se a data e a hora deste dispositivo estão corretas antes de continuar. "
            "É altamente recomendável corrigir a configuração de data e hora deste dispositivo, se necessário. "
            "Se o problema persistir, entre em contato com o suporte do OpenRango: "
            "suport-or@fabianovasconcelos.com"
        ),
    }
