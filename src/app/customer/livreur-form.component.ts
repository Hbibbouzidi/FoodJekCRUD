import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Livreur } from './livreur';
import { LivreurService } from './livreur.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';


@Component({
    selector: 'livreur-form',
    templateUrl: './livreur-form.component.html',
    styles: [`
    .title-spacer {
        flex: 1 1 auto;
      }
    .form-field{
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
    }
    .avatar-field {
        left: 0;
        margin: 0 auto;
        position: absolute;
        margin-left: 50px;
    }
    `]
})
export class LivreurFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Update Livreur';
    errorMessage: string;
    livreurForm: FormGroup;
    livreur: Livreur = <Livreur>{};
    private sub: Subscription;
    showImage: boolean;
    imageWidth: number = 100;
    imageMargin: number = 2;
    fieldColspan = 3;

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private genericValidator: GenericValidator;

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    private validationMessages: { [key: string]: { [key: string]: string } | {} } = {
        firstname: {
            required: 'Livreur name is required.',
            minlength: 'Livreur name must be at least one characters.',
            maxlength: 'Livreur name cannot exceed 100 characters.'
        },
        address: {
            required: 'Livreur address is required.',
            minlength: 'Livreur address must be at least one characters.',
            maxlength: 'Livreur address cannot exceed 100 characters.'
        },
        cin: {
            required: 'Livreur cin is required.',
            minlength: 'Livreur cin must be at least one characters.',
            maxlength: 'Livreur cin cannot exceed 200 characters.'
        }
    };

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private livreurService: LivreurService,
        private breakpointObserver: BreakpointObserver
    ) {
        breakpointObserver.observe([
            Breakpoints.HandsetLandscape,
            Breakpoints.HandsetPortrait
        ]).subscribe(result => {
            // console.log(result)
            this.onScreensizeChange(result);
        });
        this.genericValidator = new GenericValidator(this.validationMessages);

    }

    ngOnInit(): void {
        this.livreurForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            cin: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        });

        // Read the customer Id from the route parameter
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getLivreur(id);
            }
        );

        this.sub.add(null);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.livreurForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.livreurForm);
        });
    }

    getLivreur(id: number): void {
        this.livreurService.getLivreur(id)
            .subscribe(
                (livreur: Livreur) => this.onLivreurRetrieved(livreur),
                (error: any) => this.errorMessage = <any>error
            );
    }

    onLivreurRetrieved(livreur: Livreur): void {
        if (this.livreurForm) {
            this.livreurForm.reset();
        }
        this.livreur = livreur;

        if (this.livreur.id === 0) {
            this.pageTitle = 'New Livreur';
        } else {
            this.pageTitle = `Livreur: ${this.livreur.firstname} ${this.livreur.lastname}`;
        }

        // Update the data on the form
        this.livreurForm.patchValue({
            cin: this.livreur.cin,
            firstname: this.livreur.firstname,
            lastname: this.livreur.lastname,
            address: this.livreur.address,
            tel: this.livreur.tel,
            latitude: this.livreur.latitude,
            longitude: this.livreur.longitude
        });
    }

    deleteLivreur(): void {
        if (this.livreur.id === 0) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
        } else {
            if (confirm(`Really delete the livreur: ${this.livreur.firstname}?`)) {
                this.livreurService.deleteLivreur(this.livreur.id)
                    .subscribe(
                        () => this.onSaveComplete(),
                        (error: any) => this.errorMessage = <any>error
                    );
            }
        }
    }

    toggleImage(): void {
        event.preventDefault();
        this.showImage = !this.showImage;
    }


    saveLivreur(): void {
        if (this.livreurForm.dirty && this.livreurForm.valid) {
            // Copy the form values over the customer object values
            const livreur = Object.assign({}, this.livreur, this.livreurForm.value);

            this.livreurService.saveLivreur(livreur)
                .subscribe(
                    () => this.onSaveComplete(),
                    (error: any) => this.errorMessage = <any>error
                );
        } else if (!this.livreurForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.livreurForm.reset();
        this.router.navigate(['/livreurs']);
    }

    onScreensizeChange(result: any) {
        // debugger
        const isLess600 = this.breakpointObserver.isMatched('(max-width: 599px)');
        const isLess1000 = this.breakpointObserver.isMatched('(max-width: 959px)');
        console.log(
            ` isLess600  ${isLess600} 
            isLess1000 ${isLess1000}  `
        )
        if (isLess1000) {
            if (isLess600) {
                this.fieldColspan = 12;
            }
            else {
                this.fieldColspan = 6;
            }
        }
        else {
            this.fieldColspan = 3;
        }
    }
}
