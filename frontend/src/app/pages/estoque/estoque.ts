import { ChangeDetectorRef, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

const API_URL = environment.apiUrl;

@Component({
  selector: "app-estoque",
  imports: [FormsModule, CommonModule],
  templateUrl: "./estoque.html",
  styleUrl: "./estoque.css",
})
export class Estoque {

  private monitorQueue: any[] = [];
  private monitorQueueTimer?: ReturnType<typeof setTimeout>;

  addMonitorEvent(
    prefix: string,
    before: string,
    bold?: string,
    after?: string,
    group = false
  ) {
    this.http.get<any>(`${API_URL}/horario`).subscribe((response) => {
      const time = new Date(response.datetime).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const event = {
        time,
        prefix,
        before,
        bold,
        after,
        highlight: true,
        createdAt: Date.now(),
      };

      if (!group) {
        this.monitorEvents.unshift(event);
        this.cdr.detectChanges();

        setTimeout(() => {
          event.highlight = false;
          this.cdr.detectChanges();
        }, 2000);

        return;
      }
      this.monitorQueue.push(event);

      clearTimeout(this.monitorQueueTimer);

      this.monitorQueueTimer = setTimeout(() => {
        this.monitorEvents.unshift(...this.monitorQueue.reverse());
        this.monitorQueue = [];
        this.cdr.detectChanges();

        setTimeout(() => {
          this.monitorEvents.forEach(item => item.highlight = false);
          this.cdr.detectChanges();
        }, 2000);
      }, 1000);

    });
  }

  createProduct() {
    if (Number(this.price.replace(/\D/g, "")) <= 0) {
      this.addMonitorEvent(
        "=> ❌",
        "É preciso definir um valor ",
        "em R$",
        " maior que zero para o produto."
      );
      return;
    }

    if (Number(this.volume) <= 0) {
      this.addMonitorEvent(
        "=> ❌",
        "É preciso definir um valor maior que zero para o ",
        "Volume",
        "."
      );
      return;
    }

    if (!this.unit.trim()) {
      this.addMonitorEvent(
        "=> ❌",
        "Não é possível deixar o campo ",
        '"Unidade"',
        " em branco."
      );
      return;
    }

    if (!this.name.trim()) {
      this.addMonitorEvent(
        "=> ❌",
        "Não é possível deixar o ",
        "Produto",
        " em branco."
      );
      return;
    }
    if (!this.initialQuantity.trim()) {
      this.initialQuantity = "0";

      this.addMonitorEvent(
        "=> ⚠️",
        "Warning: não foi definido um estoque inicial. Foi atribuído 0 (zero) automaticamente para ",
        this.name,
        "."
      );
    }
    const product = {
      name: this.name,
      volume: Number(this.volume),
      unit: this.unit,
      initial_quantity: Number(this.initialQuantity),
      price: Number(this.price.replace(/\D/g, "")),
      gtin: this.gtinEnabled && this.gtin ? this.gtin : null,
    };

    this.http.post(`${API_URL}/produtos`, product).subscribe({
      next: (response: any) => {
        const time = new Date(response.datetime).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        this.addMonitorEvent(
          "=> ✅",
          "Produto ",
          `"${this.name}"`,
          " cadastrado com sucesso!"
        );

        this.cdr.detectChanges();
      },

      error: () => {
        this.addMonitorEvent(
          "=> ❌",
          "Ocorreu um erro ao cadastrar esse produto. Para maiores esclarecimentos, contate o suporte."
        );
      },
    });
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  gtinEnabled = false;
  name = "";
  volume = "";
  unit = "";
  initialQuantity = "";
  gtin = "";
  price = "";
  monitorEvents: {
    time: string;
    prefix: string;
    before: string;
    bold?: string;
    after?: string;
    highlight?: boolean;
  }[] = [];
}