import { Component, OnInit, ViewChild } from '@angular/core';

import { Plat } from './plat';
import { PlatService } from './plat.service';
import { PagerService } from '../_services';
import { ConfirmDialog } from '../shared';
import * as _ from 'lodash';

import {MatDialog} from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';


@Component({
    selector: 'plat-list',
    templateUrl: './plat-list.component.html',
    styleUrls: ['./plat-list.component.css'],
    providers: [ConfirmDialog]
})
export class PlatListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    pageTitle: string = 'Plats';
    imageWidth: number = 30;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: any = {};
    errorMessage: string;

    plats: Plat[];
    platList: Plat[]; //
    displayedColumns = ["name", "description", "price", "image", "restaurant", "id"];
    dataSource: any = null;
    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {
        name: "",
        description: "",
        price: ""
    };
    selectedOption: string;


    constructor(
        private platService: PlatService,
        // private pagerService: PagerService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    freshDataList(plats: Plat[]) {
        this.plats = plats;

        this.platList = plats.map(e => {
            const plat = e;
            e["restaurantName"] = e["restaurant"]["restaurantName"];
            return plat;
        });
        this.dataSource = new MatTableDataSource(this.plats);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.platService.getPlats()
            .subscribe(plats => {
                this.freshDataList(plats);
            },
            error => this.errorMessage = <any>error);

        this.searchFilter = {};
        this.listFilter = {};
    }

    getPlats(pageNum?: number) {
        this.platService.getPlats()
            .subscribe(plats => {
                this.freshDataList(plats);
            },
            error => this.errorMessage = <any>error);
    }

    searchPlats(filters: any) {
        if (filters) {
            this.platService.getPlats()
                .subscribe(plats => {
                    this.plats = plats;
                    console.log(this.plats.length)
                    this.plats = this.plats.filter((plat: Plat) => {
                        let match = true;

                        Object.keys(filters).forEach((k) => {
                            match = match && filters[k] ?
                                plat[k].toLocaleLowerCase().indexOf(filters[k].toLocaleLowerCase()) > -1 : match;
                        })
                        return match;
                    });
                    this.freshDataList(plats);
                },
                error => this.errorMessage = <any>error);
        }

    }

    resetListFilter() {
        this.listFilter = {};
        this.getPlats();
    }

    reset() {
        this.listFilter = {};
        this.searchFilter = {};
        this.getPlats();

    }

    resetSearchFilter(searchPanel: any) {
        searchPanel.toggle();
        this.searchFilter = {};
        this.getPlats();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 1500,
        });
    }

    openDialog(id: number) {
        let dialogRef = this.dialog.open(ConfirmDialog,
            { data: { title: 'Dialog', message: 'Are you sure to delete this plat?' } });
        dialogRef.disableClose = true;


        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;

            if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
                this.platService.deletePlat(id).subscribe(
                    () => {
                        this.platService.getPlats()
                            .subscribe(plats => {
                                this.freshDataList(plats);
                            },
                            error => this.errorMessage = <any>error);
                        this.openSnackBar("The plat has been deleted successfully. ", "Close");
                    },
                    (error: any) => {
                        this.errorMessage = <any>error;
                        console.log(this.errorMessage);
                        this.openSnackBar("This plat has not been deleted successfully. Please try again.", "Close");
                    }
                );
            }
        });
    }



}
