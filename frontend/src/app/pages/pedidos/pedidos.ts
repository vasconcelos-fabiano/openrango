import { ChangeDetectorRef, Component } from "@angular/core";
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
  productInRemovalAlert: any = null;
  productInQuantityDialog: any = null;
  removalAlertTimer: any;
  removalTimer: any;
  removedByHold = false;
  nextOrderNumber: number | null = null;
  serverDateTime: string | null = null;
  readonly maxProductQuantity = 999;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loadProducts();
    this.loadNextOrderNumber();
  }

  startProductRemoval(product: any) {
    clearTimeout(this.removalAlertTimer);
    clearTimeout(this.removalTimer);
    this.productInRemovalAlert = null;
    this.removedByHold = false;

    this.removalAlertTimer = setTimeout(() => {
      this.productInRemovalAlert = product;
      this.cdr.markForCheck();
    }, 800);

    this.removalTimer = setTimeout(() => {
      this.removedByHold = true;

      this.selectedProducts = this.selectedProducts.filter(
        item => item.id !== product.id
      );

      this.productInRemovalAlert = null;
      this.cdr.markForCheck();
    }, 2000);
  }

  cancelProductRemoval() {
    clearTimeout(this.removalAlertTimer);
    clearTimeout(this.removalTimer);
    this.productInRemovalAlert = null;
  }

  openQuantityDialog(product: any) {
    this.productInQuantityDialog = product;
  }

  closeQuantityDialog() {
    this.productInQuantityDialog = null;
  }

  finishProductRemoval(product: any) {
    clearTimeout(this.removalAlertTimer);
    clearTimeout(this.removalTimer);

    this.productInRemovalAlert = null;

    if (this.removedByHold) {
      return;
    }

    this.decreaseQuantity(product);
  }

  productPrice(product: any) {
    return Number(product.preco_venda) / 100;
  }

  formatCurrency(value: number) {
    return value.toFixed(2).replace('.', ',');
  }

  formatMoneyInput(event: Event, field: 'deliveryFee' | 'discountValue') {
    const input = event.target as HTMLInputElement;

    const digits = input.value.replace(/\D/g, '').padStart(3, '0');
    const formatted = `${parseInt(digits.slice(0, -2), 10)},${digits.slice(-2)}`;

    input.value = formatted;

    const value = Number(formatted.replace(',', '.'));

    if (field === 'deliveryFee') {
      this.deliveryFee = value;
    } else {
      this.discountValue = value;
    }
  }

  sanitizeQuantityInput(event: Event) {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '').slice(0, 3);

    if (value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    input.value = value;
  }

  confirmQuantity(input: HTMLInputElement) {
    if (!this.productInQuantityDialog) {
      return;
    }

    const quantity = Number(input.value);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > this.maxProductQuantity
    ) {
      return;
    }

    this.productInQuantityDialog.quantidade = quantity;
    this.closeQuantityDialog();
  }


  formatOrderItems() {
    const IND = "  ";
    const items: string[] = [];

    this.selectedProducts.forEach(product => {
      const quantity = product.quantidade;
      const unitPrice = this.productPrice(product);
      const subtotal = quantity * unitPrice;

      const fullName = product.tamanho
        ? `${product.nome} ${product.tamanho}${product.unidade}`.trim()
        : product.nome;

      items.push(
        `${quantity.toString().padStart(3, "0")} ${fullName}`
      );

      items.push(
        `${IND}${quantity} x (R$${this.formatCurrency(unitPrice)}) = R$${this.formatCurrency(subtotal)}`
      );
    });

    return items;
  }

  calculateOrderTotals() {
    const itemsTotal = this.selectedProducts.reduce(
      (total, product) =>
        total + product.quantidade * this.productPrice(product),
      0
    );

    const discountInput = this.discountValue ?? 0;

    let discount = this.discountType === 'percent'
      ? itemsTotal * (discountInput / 100)
      : discountInput;

    if (discount > itemsTotal) {
      discount = itemsTotal;
    }

    const deliveryFee = this.deliveryFee ?? 0;
    const total = itemsTotal - discount + deliveryFee;

    return {
      itemsTotal,
      discount,
      deliveryFee,
      total
    };
  }

  formatOrderDateTime() {
    if (!this.serverDateTime) {
      return '';
    }

    const now = new Date(this.serverDateTime);

    const weekdays = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ];

    return `${weekdays[now.getDay()]}, ${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} [ ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}h ]`;
  }

  generateOrderNote(customerInput: HTMLInputElement) {

    if (this.customerName.trim().length < 3) {
      customerInput.setCustomValidity(
        'Informe o nome do cliente com pelo menos 3 caracteres.'
      );
      customerInput.reportValidity();
      return;
    }

    customerInput.setCustomValidity('');
    if (this.selectedProducts.length === 0) {
      alert('Adicione pelo menos um item ao pedido antes de gerar a notinha.');
      return;
    }

    this.http
      .get<{
        datetime: string;
        source: 'NIST' | 'NPL' | 'local';
        warning?: string;
      }>('http://192.168.18.9:8000/horario')
      .subscribe(response => {
        this.serverDateTime = response.datetime;

        if (response.source === 'local') {
          alert(
            response.warning ??
            'Não foi possível obter a data e a hora dos servidores remotos. Verifique a data e a hora deste computador antes de continuar.'
          );
        }

        const SEP = "------------------------------";
        const items = this.formatOrderItems();
        const totals = this.calculateOrderTotals();

        const noteLines = [
          SEP,
          `Pedido #${String(this.nextOrderNumber ?? 0).padStart(4, '0')}`,
          `de ${this.customerName}`,
          this.formatOrderDateTime(),
          SEP,
          `\r`,
          ...items
        ];

        if (totals.discount > 0) {
          noteLines.push(
            "",
            `🎁 Desconto: R$${this.formatCurrency(totals.discount)}`
          );

          if (this.reasonDiscount) {
            noteLines.push(` << ${this.reasonDiscount} >>`);
          }
        }

        if (totals.deliveryFee > 0) {
          noteLines.push(
            "",
            `Taxa de entrega R$${this.formatCurrency(totals.deliveryFee)}`
          );
        }

        noteLines.push(
          "",
          SEP,
          "",
          `*TOTAL DO PEDIDO: R$${this.formatCurrency(totals.total)}*`,
          "",
          SEP,
          "",
          "*Formas de Pagamento:*",
          "💳 *No cartão:* Crédito e Débito",
          "💵 *Em cash:* Dinheiro e PIX",
          "🎫 *VA/VR:* Caju, Flash, iFood e Pluxee",
          "",
          "Como você prefere pagar?"
        );

        this.orderNote = noteLines.join('\n');
        this.cdr.markForCheck();
      });
  }

  loadProducts() {
    this.http.get('http://192.168.18.9:8000/produtos').subscribe(products => {
      this.products = products as any[];
      this.filteredProducts = this.products;
    });
  }

  loadNextOrderNumber() {
    this.http
      .get<{ proximo_numero: number }>(
        'http://192.168.18.9:8000/pedidos/proximo-numero'
      )
      .subscribe(response => {
        this.nextOrderNumber = response.proximo_numero;
      });
  }

  selectProduct(product: any) {
    const existingProduct = this.selectedProducts.find(
      item => item.id === product.id
    );
    if (existingProduct) {
      existingProduct.quantidade = Math.min(
        existingProduct.quantidade + 1,
        this.maxProductQuantity
      );
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
    product.quantidade = Math.min(
      product.quantidade + 1,
      this.maxProductQuantity
    );
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

  copyOrderNote() {
    if (!this.orderNote) {
      return;
    }

    navigator.clipboard.writeText(this.orderNote).then(() => {
      alert('Notinha copiada para a área de transferência!');
    });
  }

  confirmCancelOrder() {
    this.orderStarted = false;
    this.showCancelDialog = false;
    this.customerName = '';
    this.productSearch = '';
    this.selectedProducts = [];
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
    this.serverDateTime = null;
  }
}
