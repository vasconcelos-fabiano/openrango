import { Component } from "@angular/core";

@Component({
  selector: "app-pedidos",
  imports: [],
  templateUrl: "./pedidos.html",
  styleUrl: "./pedidos.css",
})
export class Pedidos {
  tipoSelecionado = 'delivery';
  selecionarTipo(tipo: string) {
    console.log(tipo);
  }
}
