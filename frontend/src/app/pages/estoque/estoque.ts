import { ChangeDetectorRef, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-estoque",
  imports: [FormsModule, CommonModule],
  templateUrl: "./estoque.html",
  styleUrl: "./estoque.css",
})
export class Estoque {

  addMonitorEvent(
    prefix: string,
    before: string,
    bold?: string,
    after?: string
  ) {
    this.http.get<any>("/api/horario").subscribe((response) => {
      const time = new Date(response.datetime).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      this.monitorEvents.unshift({ time, prefix, before, bold, after });
      setTimeout(() => {
        this.cdr.detectChanges();
      });
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

    this.http.post("/api/produtos", product).subscribe({
      next: (response: any) => {
        const time = new Date(response.datetime).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        this.monitorEvents.unshift({
          time,
          prefix: "=> ✅",
          before: "Produto ",
          bold: `"${this.name}"`,
          after: " cadastrado com sucesso!",
        });

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
  }[] = [];
}