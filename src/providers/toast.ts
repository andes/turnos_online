import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastProvider {

  constructor(private toastCtrl: ToastController) {
    //
  }

  async displayToast(title, type = 'success', time = 3000, callbak = null) {
    const toast = await this.toastCtrl.create({
      message: title,
      duration: time,
      position: 'bottom',
      cssClass: type
    });

    // toast.onDidDismiss(() => {
    //   if (callbak) {
    //     callbak();
    //   }
    // });
    // await toast.onDidDismiss();

    toast.present();
    const { role } = await toast.onDidDismiss();

    switch (role) {
      case 'cancel':
        console.log(`User cancelled.`);
        break;
      case 'timeout':
        console.log(`Timeout.`);
        break;
    }
  }

  public async success(text, duration = 3000, callbak = null) {
    this.displayToast(text, 'success', duration, callbak);
  }

  public async danger(text, duration = 3000, callbak = null) {
    this.displayToast(text, 'danger', duration, callbak);
  }


}

