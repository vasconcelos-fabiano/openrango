import { ChangeDetectorRef, Component } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
const API_URL = environment.apiUrl;

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, RouterLink],
  templateUrl: "./main-layout.html",
  styleUrl: "./main-layout.css",
})
export class MainLayout {
  sidebarAberta = false;
  currentDateTime = '';
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loadServerDateTime();
  }
  loadServerDateTime() {
    this.http.get<any>(`${API_URL}/horario`).subscribe((response) => {
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
        this.currentDateTime = this.currentDateTime.replace('.,', ',').replace(/,\s(?=\d{2}:\d{2}$)/, ' ');

      this.cdr.markForCheck();

    });
  }

  alternarSidebar() {
    this.sidebarAberta = !this.sidebarAberta;
  }
}
