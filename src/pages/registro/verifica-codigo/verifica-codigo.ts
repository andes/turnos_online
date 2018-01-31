import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage'
import { AlertController } from 'ionic-angular';

// pages
import { RegistroUserDataPage } from '../user-data/user-data';

// providers
import { AuthProvider } from '../../../providers/auth/auth';
import { ToastProvider } from '../../../providers/toast';
import { DeviceProvider } from '../../../providers/auth/device';

@Component({
  selector: 'page-verifica-codigo',
  templateUrl: 'verifica-codigo.html',
})
export class VerificaCodigoPage {
  mostrarMenu: boolean = false;
  formIngresoCodigo: FormGroup;
  submit: boolean = false;
  email: any = '';
  codigo: string;
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  running = false;

  constructor(
    public toastProvider: ToastProvider,
    public alertCtrl: AlertController,
    public storage: Storage,
    public authService: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public deviceProvider: DeviceProvider) {

    this.formIngresoCodigo = formBuilder.group({
      codigo: ['', Validators.compose([Validators.required, Validators.maxLength(6)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])],
      // codigo: ['']
    });

  }

  ngOnDestroy() {
  }

  ionViewDidLoad() {
  }

  codeTostring(code) {
      let c = String(code);
      while (c.length < 6) { c = '0' + c};
      return c;
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.running = true;
    this.authService.checkCode(value.email, value.codigo).then(() => {
      this.running = false;
      this.navCtrl.push(RegistroUserDataPage, {email: value.email, code: this.codeTostring(value.codigo)});

    }).catch((err) => {
      this.running = false;
        if (err) {
          if (err.message === 'email existente') {
            this.toastProvider.danger('EL EMAIL YA ESTA EN USO');
          } else {
            this.toastProvider.danger('CODIGO INCORRECTO O EXPIRADO');
          }
        }
    });

  }

  showAlert(title: string, text: string) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
