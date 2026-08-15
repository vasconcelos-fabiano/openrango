import { Component } from "@angular/core";
import { NotImplemented } from "../not-implemented/not-implemented";

@Component({
  selector: "app-pedidos",
  imports: [NotImplemented],
  templateUrl: "./pedidos.html",
  styleUrl: "./pedidos.css",
})
export class Pedidos {
  tipoSelecionado = 'delivery';
  selecionarTipo(tipo: string) {
    this.tipoSelecionado = tipo;
  }
}
