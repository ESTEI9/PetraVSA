import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    freedomUrl = "https://freedomchoiceglobal.com/api/demo/";

    transactionsUrl = this.freedomUrl + "transactions.php";
    reportUrl = this.freedomUrl + "report.php";
    signupUrl = this.freedomUrl + "signup.php";
    loginUrl = this.freedomUrl + "login.php";
    merchantDataUrl = this.freedomUrl + "merchantdata.php";
    cashierDataUrl = this.freedomUrl + "cashierdata.php";
    velocityUrl = "https://api.cert.nabcommerce.com";
  
  
    constructor(
      public http: HttpClient
    ) {
      console.log('Hello DataProvider Provider');
    }
  
    userData(type) {
      return this.http.post(this.freedomUrl + type, "");
    }
  
    serviceTransaction(data){
      return this.http.post(this.transactionsUrl, data, {headers  : {'Content-Type': 'application/x-www-form-urlencoded'} });
    }
    
    submitReport(data){
      return this.http.post(this.reportUrl, data, {headers  : {'Content-Type': 'application/x-www-form-urlencoded'} });
    }
  
    completeSetup(data){
      return this.http.post(this.signupUrl, data, {headers  : {'Content-Type': 'application/x-www-form-urlencoded'} });
    }
  
    login(data){
      return this.http.post(this.loginUrl, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'} });
    }
  
    merchantApi(data){
      return this.http.post(this.merchantDataUrl, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'} });
    }
  
    cashierApi(data){
      return this.http.post(this.cashierDataUrl, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'} });
    }
  
    velocityLogin(token){
      return this.http.get(this.velocityUrl + "/REST/2.0.18/SvcInfo/token", {headers: {'Authorization': token} });
    }
  
    velocityPayment(body, sessionToken){
      return this.http.post(this.velocityUrl + "/REST/2.0.18/Txn/8D9DE00001", body, {headers: {'Content-Type' : 'application/json; charset=UTF-8', 'Authorization': sessionToken} });
    }
}
