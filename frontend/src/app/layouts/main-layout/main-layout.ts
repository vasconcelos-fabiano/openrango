import { Component } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, RouterLink],
  templateUrl: "./main-layout.html",
  styleUrl: "./main-layout.css",
})
export class MainLayout {
  sidebarAberta = false;
  currentDateTime = '';
  constructor(private http: HttpClient) {
    this.loadServerDateTime();
  }
  loadServerDateTime() {
    this.http.get<any>('http://192.168.18.9:8000/horario').subscribe((response) => {
      this.currentDateTime = new Date(response.datetime).toLocaleString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      this.currentDateTime =
        this.currentDateTime.charAt(0).toUpperCase() +
        this.currentDateTime.slice(1);
      console.log('SIDEBAR:', this.currentDateTime);

    });
  }

  alternarSidebar() {
    this.sidebarAberta = !this.sidebarAberta;
  }
}
