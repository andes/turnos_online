import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
// Providers
import { AuthProvider } from '../../../../providers/auth/auth';
import { ToastProvider } from '../../../../providers/toast';

@Component({
    selector: 'app-recuperar-password',
    templateUrl: 'recuperar-password.html',
})
export class RecuperarPasswordPage implements OnInit {
    public formRecuperar: any;
    public formResetear: any;
    public displayForm = false;
    public reset: any = {};
    public inProgress = false;
    @ViewChild(IonContent) content: IonContent;

    constructor(
        private authProvider: AuthProvider,
        private toast: ToastProvider,
        private formBuilder: FormBuilder,
        private router: Router) {
    }

    ngOnInit(): void {
        const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
        this.formRecuperar = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])]
        });
        this.formResetear = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            codigo: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])],
            password2: ['', Validators.compose([Validators.required])]
        });
    }

    public sendCode() {
        const email = this.formRecuperar.value.email;
        this.inProgress = true;
        this.authProvider.resetPassword(email).then(result => {
            this.inProgress = false;
            this.content.scrollToTop();
            this.toast.success('EL CODIGO FUE ENVIADO');
            this.displayForm = true;
            this.formResetear.patchValue({ email });
        }).catch(error => {
            this.inProgress = false;
            if (error) {
                this.toast.danger(error.error);
            }
        });
    }

    public yaTengo() {
        this.displayForm = true;
        this.content.scrollToTop();
    }

    public resetPassword() {
        const email = this.formResetear.value.email;
        const codigo = this.formResetear.value.codigo;
        const password = this.formResetear.value.password;
        const password2 = this.formResetear.value.password2;
        if (password !== password2) {
            this.toast.danger('LAS CONTRASEÑAS NO COINCIDEN');
            return;
        }
        this.inProgress = true;
        this.authProvider.restorePassword(email, codigo, password, password2).then((data) => {
            this.inProgress = false;
            this.toast.success('PASSWORD MODIFICADO CORRECTAMENTE');
            this.router.navigate(['home']);
        }).catch((err) => {
            this.inProgress = false;
            if (err) {
                this.toast.danger(err.error);
            }
        });
    }

    public cancel() {
        this.displayForm = false,
            this.reset = {};
    }

    public onKeyPress($event, tag) {
        if ($event.keyCode === 13) {
            if (tag === 'submit-1') {
                if (this.formRecuperar && this.formRecuperar.valid) {
                    this.sendCode();
                } else {
                    this.toast.danger('Revise los datos ingresados');
                }
            } else if (tag === 'submit-2') {
                if (this.formResetear && this.formResetear.valid) {
                    this.resetPassword();
                } else {
                    this.toast.danger('Revise los datos ingresados');
                }
            } else {
                const element = document.getElementById(tag);
                if (element) {
                    element.focus();
                }
            }
        }
    }
}
