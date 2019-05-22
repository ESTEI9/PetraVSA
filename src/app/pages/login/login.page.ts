import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    private locationId: string;
    private merchantId: string;
    private phone: string = "";
    private pin: string = "";
    private phoneFormatted: string = "";
    private cashierId: string = "";
    private adminId: string = "";
    private uuid: any;
    private cashiers: any;
    private admins: any;
    private navParamsData: any;
    private loginType: string = "Cashier";

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public data: ApiService,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController
    ) {
        this.navParamsData = this.navParams.data;
        console.log(this.navParamsData);

        if (this.navParamsData['merchant']) {
            this.locationId = this.navParamsData['device']['merchant_location_id'];
            this.merchantId = this.navParamsData['merchant']['merchant_id'];
        } else {
            this.locationId = this.navParams.get('locationId');
            this.merchantId = this.navParams.get('merchantId');
        };
    }

    ngOnInit() {
    }

    ionViewWillLoad() {
        let type = "action=loadcashiers"
            + '&merchantlocationid=' + this.locationId
            + '&merchantid=' + this.merchantId;

        this.data.cashierApi(type).subscribe(async (resp: any) => {
            if (resp.status == 1) {
                this.cashiers = resp.data.cashiers;
                this.admins = resp.data.admins;
            } else {
                let error = await this.alertCtrl.create({
                    message: "We can't get the cashiers or admins for this store! Please contact Freedom Choice."
                });
                await error.present();
            };
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
        console.log(this.navParams);
    }

    doSignIn() {
        let loginId: string;
        if (this.loginType === 'Cashier') {
            loginId = this.cashierId;
        } else {
            loginId = this.adminId;
        };

        let url = "action=login&loginid=" + loginId + "&pin=" + this.pin + "&logintype=" + this.loginType; // Login for Cashier in Cashier Facing 
        // let url = "login.php?type=merchant&phone=" + this.phone + "&password=" + this.pin; // Login for Merchant in Customer Facing 

        setTimeout(() => {
            this.data.cashierApi(url).subscribe(async (resp: any) => {
                if (resp.status == 1) {
                    if (this.loginType === 'Cashier') {
                        this.navParamsData['cashier'] = resp.data.cashier;
                        this.navCtrl.navigateRoot('cashier-dash', this.navParamsData);
                    } else {
                        this.navParamsData['admin'] = resp.data.admin;
                        this.navCtrl.navigateRoot('admin-dash', this.navParamsData);
                    };
                } else {
                    let toast = await this.toastCtrl.create({
                        message: "The phone and password don't match.",
                        duration: 3000,
                        position: 'top'
                    });
                    await toast.present();
                }
            }, async (err) => {
                console.log(err);
                // Unable to log in
                let toast = await this.toastCtrl.create({
                    message: 'Connection error. Please try again.',
                    duration: 3000,
                    position: 'top'
                });
                await toast.present();
            });
        }, 0);
    }

    goToTutorial() {
        this.navCtrl.navigateForward('tutorial');
    }

}
