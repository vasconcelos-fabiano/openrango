import { Component } from "@angular/core";
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
  createProduct() {
    const product = {
      name: this.name,
      volume: Number(this.volume),
      unit: this.unit,
      initial_quantity: Number(this.initialQuantity),
      price: Number(this.price.replace(/\D/g, "")),
      gtin: this.gtinEnabled && this.gtin ? this.gtin : null,
    };

    this.http.post("/api/produtos", product).subscribe();
  }

  constructor(private http: HttpClient) { }
  gtinEnabled = false;
  name = "";
  volume = "";
  unit = "";
  initialQuantity = "";
  gtin = "";
  price = "";
  monitorMessage = "";
  monitorType = "";
}
