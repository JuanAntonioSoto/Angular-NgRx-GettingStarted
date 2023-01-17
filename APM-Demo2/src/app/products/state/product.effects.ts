import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { Action } from "rxjs/internal/scheduler/Action";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";

import { ProductService } from "../product.service";
import * as ProductActions from "./product.actions";

@Injectable()
export class ProductEffects {
    constructor(private action$: Actions,
        private productService: ProductService) { }

    loadProducts$ = createEffect(() => {
        return this.action$.pipe(
            ofType(ProductActions.loadProducts),
            mergeMap(() => this.productService.getProducts().pipe(
                map(products => ProductActions.loadProductsSuccess({ products })),
                catchError(error => of(ProductActions.loadProductsFailure({ error })))
            ))
        )
    });

    updatedProduct$ = createEffect(() => {
        return this.action$.pipe(
            ofType(ProductActions.updateProduct),
            concatMap(action =>
                this.productService.updateProduct(action.product).pipe(
                    map(product => ProductActions.updateProductSuccess({ product })),
                    catchError(error => of(ProductActions.updateProductFailure({ error })))
                )
            )
        );
    });
}