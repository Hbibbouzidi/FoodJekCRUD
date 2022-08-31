import { Component, OnInit, ViewChild } from '@angular/core';

import { Livreur } from './livreur';
import { LivreurService } from './livreur.service';
import { PagerService } from '../_services';
import { ConfirmDialog } from '../shared';
import * as _ from 'lodash';

import {MatDialog} from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';


@Component({
    selector: 'livreur-list',
    templateUrl: './livreur-list.component.html',
    styleUrls: ['./livreur-list.component.css'],
    providers: [ConfirmDialog]
})
export class LivreurListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    pageTitle: string = 'Livreurs';
    imageWidth: number = 30;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: any = {};
    errorMessage: string;

    livreurs: Livreur[];
    livreurList: Livreur[]; //
    displayedColumns = ["cin","firstname","lastname", "address", "tel", "latitude","longitude", "id"];
    dataSource: any = null;
    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {
        cin: "",
        firstname: "",
        address: ""
    };
    selectedOption: string;


    constructor(
        private livreurService: LivreurService,
        // private pagerService: PagerService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    freshDataList(livreurs: Livreur[]) {
        this.livreurs = livreurs;

        this.dataSource = new MatTableDataSource(this.livreurs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.livreurService.getLivreurs()
            .subscribe(livreurs => {
                this.freshDataList(livreurs);
            },
            error => this.errorMessage = <any>error);

        this.searchFilter = {};
        this.listFilter = {};
    }

    getLivreurs(pageNum?: number) {
        this.livreurService.getLivreurs()
            .subscribe(livreurs => {
                this.freshDataList(livreurs);
            },
            error => this.errorMessage = <any>error);
    }

    searchLivreurs(filters: any) {
        if (filters) {
            this.livreurService.getLivreurs()
                .subscribe(livreurs => {
                    this.livreurs = livreurs;
                    console.log(this.livreurs.length)
                    this.livreurs = this.livreurs.filter((livreur: Livreur) => {
                        let match = true;

                        Object.keys(filters).forEach((k) => {
                            match = match && filters[k] ?
                                livreur[k].toLocaleLowerCase().indexOf(filters[k].toLocaleLowerCase()) > -1 : match;
                        })
                        return match;
                    });
                    this.freshDataList(livreurs);
                },
                error => this.errorMessage = <any>error);
        }

    }

    resetListFilter() {
        this.listFilter = {};
        this.getLivreurs();
    }

    reset() {
        this.listFilter = {};
        this.searchFilter = {};
        this.getLivreurs();

    }

    resetSearchFilter(searchPanel: any) {
        searchPanel.toggle();
        this.searchFilter = {};
        this.getLivreurs();
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
                this.livreurService.deleteLivreur(id).subscribe(
                    () => {
                        this.livreurService.getLivreurs()
                            .subscribe(livreurs => {
                                this.freshDataList(livreurs);
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
