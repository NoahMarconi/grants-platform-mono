import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { ethers, providers, utils } from 'ethers';
import { AddressZero, Zero } from "ethers/constants";
import { OrbitService } from 'src/app/services/orbit.service';

@Component({
  selector: 'app-latest-grants',
  templateUrl: './latest-grants.component.html',
  styleUrls: ['./latest-grants.component.scss'],
})
export class LatestGrantsComponent implements OnInit {
  allGrant: any;
  grantOrbitData: any;
  searchBox: FormControl;
  searchResult: any = [];
  data = [];
  constructor(public popoverCtrl: PopoverController,
    private router: Router,
    public modalController: ModalController,
    private subgraphService: SubgraphService,
    private orbitService: OrbitService
  ) {
    this.getAllGrants();
  }

  ngOnInit() {
    this.searchBox = new FormControl('');

    this.searchBox.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((val: string) => {
        // console.log("val", val)
        if (val == '') {
          this.searchResult = [];
          this.searchResult = this.allGrant;
        } else {
          this.searchResult = []
          this.searchResult = this.allGrant.filter((data) => {
            // console.log("data.name.toLowerCase()", data.name.toLowerCase());
            return data.grantName.toLowerCase().includes(val.toLowerCase())
          });
        }
      })
  }

  onCancel(event) { }

  getGrantOrbitData(id: string, key: string) {
    // let grant = this.orbitService.getGrantsById(id);
    // console.log("grant[key]", grant[key]);

    return key
  }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id])
  }

  getAllGrants() {
    this.subgraphService.getGrantList().subscribe((res: any) => {
      console.log("res", res.data.contracts);
      this.allGrant = res.data.contracts
      this.searchResult = this.allGrant;
    })
  }

  currencyCovert(currencyType, amount) {
    if (currencyType == AddressZero) {
      return ethers.utils.formatEther(amount);
    }
    return amount;
  }
}
