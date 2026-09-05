import { Component } from "@angular/core";
import { NotImplemented } from "../not-implemented/not-implemented";
import { HttpClient } from '@angular/common/http';

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
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProducts: any[] = [];

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get('http://localhost:8000/produtos').subscribe(products => {
      this.products = products as any[];
      this.filteredProducts = this.products;
    });
  }

  selectProduct(product: any) {
    const existingProduct = this.selectedProducts.find(
      item => item.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantidade++;
    } else {
      this.selectedProducts.push({
        ...product,
        quantidade: 1
      });
    }

    this.productSearch = '';
    this.filteredProducts = [];
  }

  increaseQuantity(product: any) {
    product.quantidade++;
  }

  decreaseQuantity(product: any) {
    if (product.quantidade > 1) {
      product.quantidade--;
    } else {
      this.selectedProducts = this.selectedProducts.filter(
        item => item.id !== product.id
      );
    }
  }

  filterProducts() {
    const search = this.productSearch.toLowerCase();

    this.filteredProducts = this.products.filter(product =>
      product.nome.toLowerCase().includes(search)
    );
  }

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
