import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
// providers
import { AuthProvider } from 'src/providers/auth/auth';

@Component({
    selector: 'app-profile-profesional',
    templateUrl: 'profile-profesional.html',
})
export class ProfileProfesionalComponent implements OnInit {
    public profesional: any = null;
    public sesion;
    constructor(
        public authProvider: AuthProvider,
        public authService: AuthProvider,
        public menu: MenuController,
    ) {

    }
    ngOnInit() {
        this.profesional = this.authService.user;
        this.recuperarSesion();

    };

    onSelect($event) {
        this.authProvider.cambiarSesion($event.value);
    }
    async recuperarSesion() {
        this.sesion = await this.authProvider.checkSession();
    }
}
