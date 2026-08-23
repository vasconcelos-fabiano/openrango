import { Component } from "@angular/core";
import { NotImplemented } from "../not-implemented/not-implemented";

@Component({
  selector: "app-pedidos",
  imports: [NotImplemented],
  templateUrl: "./pedidos.html",
  styleUrl: "./pedidos.css",
})
export class Pedidos {
  orderStarted = false;
  tipoSelecionado = 'delivery';
  showCancelDialog = false;
  customerName = '';
  productSearch = '';
  deliveryFee: number | null = null;
  reasonDiscount = '';
  paymentType = '';
  deliveryDate = '';
  deliveryHour: number | null = null;
  deliveryMinute: number | null = null;
  customerPhone = '';
  discountType = 'cash';
  discountValue: number | null = null;
  deliveryType = 'immediate';
  orderNote = '';

  selecionarTipo(tipo: string) {
    this.tipoSelecionado = tipo;
  }

  startOrder() {
    this.orderStarted = true;
  }

  cancelOrder() {
    this.showCancelDialog = true;
  }

  closeCancelDialog() {
    this.showCancelDialog = false;
  }

  clearOrderNote() {
    this.orderNote = '';
  }

  confirmCancelOrder() {
    this.orderStarted = false;
    this.showCancelDialog = false;
    this.customerName = '';
    this.productSearch = '';
    this.deliveryFee = null;
    this.reasonDiscount = '';
    this.paymentType = '';
    this.deliveryDate = '';
    this.deliveryHour = null;
    this.deliveryMinute = null;
    this.customerPhone = '';
    this.discountType = 'cash';
    this.discountValue = null;
    this.deliveryType = 'immediate';
    this.tipoSelecionado = 'delivery';
    this.orderNote = '';
  }
}
