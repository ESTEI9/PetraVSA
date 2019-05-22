import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NavController, NavParams } from '@ionic/angular';
import * as moment from 'moment';

@Component({
    selector: 'app-cashier-dash',
    templateUrl: './cashier-dash.page.html',
    styleUrls: ['./cashier-dash.page.scss'],
})
export class CashierDashPage implements OnInit {

    private merchantId: string;
    private cashierName: string;
    private cashierId: string;
    private transactions: any;
    private feathers: number;
    private price: any = "0.00";
    private isInactive: boolean = true;
    private navParamsData: any;
    private buyTokensRate: string;
    private locationId: number;
    private keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0];

    constructor(
        private data: ApiService,
        private navCtrl: NavController,
        public navParams: NavParams
    ) {
        this.navParamsData = this.navParams.data;
        console.log(this.navParams);

        this.merchantId = this.navParamsData['merchant']['merchant_id'];
        this.cashierId = this.navParamsData['cashier']['cashier_id'];
        this.cashierName = this.navParamsData['cashier']['name'];
        this.buyTokensRate = this.navParamsData['location']['token_price'];
        this.locationId = this.navParamsData['location']['location_id'];
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loadTrans();
    }

    async startTrans() {
        let priceForDb = Number(this.price).toFixed(2);
        let type = "transaction=start"
            + "&price=" + priceForDb
            + "&merchantid=" + this.merchantId
            + "&cashierid=" + this.cashierId
            + "&transactiontype=Store"
            + "&locationid=" + this.locationId;

        this.data.serviceTransaction(type).subscribe((resp: any) => {
            this.navParamsData['transaction'] = {
                transactionId: resp.data,
                price: priceForDb
            };
            if (resp.tokenprice != null) {
                this.navParamsData['location']['token_price'] = resp.tokenprice;
            };
            this.navCtrl.navigateForward('payment', this.navParamsData);
        });
    }

    async convertUTCDateToLocalDate(date) {
        let stillUtc = moment.utc(date).toDate();
        let local = moment(stillUtc).local().format('MM/DD/YYYY h:mm A');
        return local;
    }

    async loadTrans() {
        let type = "load=transactions&cashierid=" + this.cashierId;
        this.data.serviceTransaction(type).subscribe((res: any) => {
            if (res.data != undefined) {
                this.transactions = res.data.transactions;
                if (this.transactions.length > 0) {
                    for (let i = 0; i < this.transactions.length; i++) {
                        let x: any = this.convertUTCDateToLocalDate(this.transactions[i].transaction_complete);
                        this.transactions[i].date = x.__zone_symbol__value;
                    };
                } else {
                    this.transactions = null;
                };
            };
        });
    }

    priceFilter(price: string) {
        let regex = new RegExp(/^\d+\.\d{2}$/i);
        //true denotes non-match
        // if(Number(price) <= 0){
        //   this.isInactive = true;
        // }; 
        if (regex.test(price)) {
            this.isInactive = false;
        } else {
            this.isInactive = true;
        };
        console.log(this.isInactive);
    }

    doLogout() {
        //this.submitReport();
        this.navCtrl.navigateRoot('', this.navParamsData);
    }

    concatPrice(key) {
        if (key == 'undo') {
            this.price = this.price.slice(0, -1);
        } else {
            this.price = String(this.price) + String(key);
            this.isInactive = false;
        };

        if (this.price.length == 0) {
            this.isInactive = true;
        } else {
            switch (this.price.indexOf(".")) {
                case 0:
                    if (key == ".") { //Add preceeding 0 to "." only values.
                        this.price = "0" + String(key);
                        this.isInactive = true;
                    };
                    break;
                case -1:
                    this.isInactive = (this.price > 0) ? false : true; //If price is more than 0
                    if (this.price.indexOf(0) == 0 && this.price.length > 1 && key != ".") { //If 0 the first digit and the next integer isn't a digit
                        this.price = this.price.slice(1);
                    }
                    break;
                default:
                    if (this.price.indexOf(".") != -1) {
                        if (this.price.slice(this.price.indexOf('.')).length > 3) { //If number of integers past "." > 2
                            this.price = String(this.price).slice(0, -1);
                            this.isInactive = false;
                        };
                        if (this.price.slice(this.price.indexOf('.')).length < 3) { //If number of integers past "." < 2
                            this.isInactive = true;
                        };
                        if (key == "." && this.price.indexOf(".") != this.price.lastIndexOf(".")) { //If more than one "."
                            this.price = this.price.slice(0, -1);
                        };
                    };
            };
        };
    }

}
