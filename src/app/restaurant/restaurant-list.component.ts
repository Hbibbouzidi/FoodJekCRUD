import { Component, OnInit, ViewChild } from '@angular/core';

import { Restaurant } from './restaurant';
import { RestaurantService } from './restaurant.service';
import { PagerService } from '../_services';
import { ConfirmDialog } from '../shared';
import * as _ from 'lodash';

import {MatDialog} from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';


@Component({
    selector: 'restaurant-list',
    templateUrl: './restaurant-list.component.html',
    styleUrls: ['./restaurant-list.component.css'],
    providers: [ConfirmDialog]
})
export class RestaurantListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    pageTitle: string = 'Restaurants';
    imageWidth: number = 30;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: any = {};
    errorMessage: string;

    restaurants: Restaurant[];
    restaurantList: Restaurant[]; //
    displayedColumns = ["name", "address", "tel", "email", "id"];
    dataSource: any = null;
    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {
        name: "",
        address: "",
        email: ""
    };
    selectedOption: string;


    constructor(
        private restaurantService: RestaurantService,
        // private pagerService: PagerService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    freshDataList(restaurants: Restaurant[]) {
        this.restaurants = restaurants;

        this.dataSource = new MatTableDataSource(this.restaurants);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.restaurantService.getRestaurants()
            .subscribe(restaurants => {
                this.freshDataList(restaurants);
            },
            error => this.errorMessage = <any>error);

        this.searchFilter = {};
        this.listFilter = {};
    }

    getRestaurants(pageNum?: number) {
        this.restaurantService.getRestaurants()
            .subscribe(restaurants => {
                this.freshDataList(restaurants);
            },
            error => this.errorMessage = <any>error);
    }

    searchRestaurants(filters: any) {
        if (filters) {
            this.restaurantService.getRestaurants()
                .subscribe(restaurants => {
                    this.restaurants = restaurants;
                    console.log(this.restaurants.length)
                    this.restaurants = this.restaurants.filter((restaurant: Restaurant) => {
                        let match = true;

                        Object.keys(filters).forEach((k) => {
                            match = match && filters[k] ?
                                restaurant[k].toLocaleLowerCase().indexOf(filters[k].toLocaleLowerCase()) > -1 : match;
                        })
                        return match;
                    });
                    this.freshDataList(restaurants);
                },
                error => this.errorMessage = <any>error);
        }

    }

    resetListFilter() {
        this.listFilter = {};
        this.getRestaurants();
    }

    reset() {
        this.listFilter = {};
        this.searchFilter = {};
        this.getRestaurants();

    }

    resetSearchFilter(searchPanel: any) {
        searchPanel.toggle();
        this.searchFilter = {};
        this.getRestaurants();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 1500,
        });
    }

    openDialog(id: number) {
        let dialogRef = this.dialog.open(ConfirmDialog,
            { data: { title: 'Dialog', message: 'Are you sure to delete this item?' } });
        dialogRef.disableClose = true;


        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;

            if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
                this.restaurantService.deleteRestaurant(id).subscribe(
                    () => {
                        this.restaurantService.getRestaurants()
                            .subscribe(restaurants => {
                                this.freshDataList(restaurants);
                            },
                            error => this.errorMessage = <any>error);
                        this.openSnackBar("The item has been deleted successfully. ", "Close");
                    },
                    (error: any) => {
                        this.errorMessage = <any>error;
                        console.log(this.errorMessage);
                        this.openSnackBar("This item has not been deleted successfully. Please try again.", "Close");
                    }
                );
            }
        });
    }



}
