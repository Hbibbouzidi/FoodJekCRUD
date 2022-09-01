import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Plat } from './plat';
import { PlatService } from './plat.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';


@Component({
    selector: 'plat-form',
    templateUrl: './plat-form.component.html',
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
export class PlatFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Update Plat';
    errorMessage: string;
    platForm: FormGroup;
    plat: Plat = <Plat>{};
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
        name: {
            required: 'Plat name is required.',
            minlength: 'Plat name must be at least one characters.',
            maxlength: 'Plat name cannot exceed 100 characters.'
        },
        description: {
            required: 'Plat descriptio is required.',
            minlength: 'Plat description must be at least one characters.',
            maxlength: 'Plat description cannot exceed 100 characters.'
        },
        price: {
            required: 'Plat price is required.',
            minlength: 'Plat price must be at least one characters.',
            maxlength: 'Plat price cannot exceed 200 characters.'
        }
    };

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private platService: PlatService,
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
        this.platForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            price: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        });

        // Read the customer Id from the route parameter
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getPlat(id);
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
        Observable.merge(this.platForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.platForm);
        });
    }

    getPlat(id: number): void {
        this.platService.getPlat(id)
            .subscribe(
                (plat: Plat) => this.onPlatRetrieved(plat),
                (error: any) => this.errorMessage = <any>error
            );
    }

    onPlatRetrieved(plat: Plat): void {
        if (this.platForm) {
            this.platForm.reset();
        }
        this.plat = plat;

        if (this.plat.id === 0) {
            this.pageTitle = 'New Plat';
        } else {
            this.pageTitle = `Plat : ${this.plat.name} ${this.plat.description}`;
        }

        // Update the data on the form
        this.platForm.patchValue({
            name: this.plat.name,
            description: this.plat.description,
            price: this.plat.price,
            image: this.plat.image,
            restaurant: this.plat.restaurant
        });
    }

    deletePlat(): void {
        if (this.plat.id === 0) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
        } else {
            if (confirm(`Really delete the plat: ${this.plat.name}?`)) {
                this.platService.deletePlat(this.plat.id)
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


    savePlat(): void {
        if (this.platForm.dirty && this.platForm.valid) {
            // Copy the form values over the customer object values
            const plat = Object.assign({}, this.plat, this.platForm.value);

            this.platService.savePlat(plat)
                .subscribe(
                    () => this.onSaveComplete(),
                    (error: any) => this.errorMessage = <any>error
                );
        } else if (!this.platForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.platForm.reset();
        this.router.navigate(['/plats']);
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
