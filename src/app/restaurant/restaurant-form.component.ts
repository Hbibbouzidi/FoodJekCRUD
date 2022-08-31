import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, MaxLengthValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Restaurant } from './restaurant';
import { RestaurantService } from './restaurant.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';


@Component({
    selector: 'restaurant-form',
    templateUrl: './restaurant-form.component.html',
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
export class RestaurantFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Update Restaurant';
    errorMessage: string;
    restaurantForm: FormGroup;
    restaurant: Restaurant = <Restaurant>{};
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
            required: 'Restaurant name is required.',
            minlength: 'Restaurant name must be at least one characters.',
            maxlength: 'Restaurant name cannot exceed 100 characters.'
        },
        address: {
            required: 'Restaurant address is required.',
            minlength: 'Restaurant address must be at least one characters.',
            maxlength: 'Restaurant address cannot exceed 100 characters.'
        },
        email: {
            required: 'Restaurant email is required.',
            minlength: 'Restaurant email must be at least one characters.',
            maxlength: 'Restaurant email cannot exceed 200 characters.'
        }
    };

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private restaurantService: RestaurantService,
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
        this.restaurantForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        });

        // Read the customer Id from the route parameter
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getRestaurant(id);
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
        Observable.merge(this.restaurantForm.valueChanges, ...controlBlurs).debounceTime(500).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.restaurantForm);
        });
    }

    getRestaurant(id: number): void {
        this.restaurantService.getRestaurant(id)
            .subscribe(
                (restaurant: Restaurant) => this.onRestaurantRetrieved(restaurant),
                (error: any) => this.errorMessage = <any>error
            );
    }

    onRestaurantRetrieved(restaurant: Restaurant): void {
        if (this.restaurantForm) {
            this.restaurantForm.reset();
        }
        this.restaurant = restaurant;

        if (this.restaurant.id === 0) {
            this.pageTitle = 'New Restaurant';
        } else {
            this.pageTitle = `Restaurant: ${this.restaurant.name} ${this.restaurant.address}`;
        }

        // Update the data on the form
        this.restaurantForm.patchValue({
            name: this.restaurant.name,
            address: this.restaurant.address,
            tel: this.restaurant.tel,
            email: this.restaurant.email
        });
    }

    deleteRestaurant(): void {
        if (this.restaurant.id === 0) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
        } else {
            if (confirm(`Really delete the restaurant: ${this.restaurant.name}?`)) {
                this.restaurantService.deleteRestaurant(this.restaurant.id)
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


    saveRestaurant(): void {
        if (this.restaurantForm.dirty && this.restaurantForm.valid) {
            // Copy the form values over the customer object values
            const restaurant = Object.assign({}, this.restaurant, this.restaurantForm.value);

            this.restaurantService.saveRestaurant(restaurant)
                .subscribe(
                    () => this.onSaveComplete(),
                    (error: any) => this.errorMessage = <any>error
                );
        } else if (!this.restaurantForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.restaurantForm.reset();
        this.router.navigate(['/restaurants']);
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
