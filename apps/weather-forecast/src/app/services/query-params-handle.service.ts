import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class QueryParamsHandleService {
	constructor(private router: Router, private route: ActivatedRoute) {}

	updateQueryParam(param: string, val: string): void {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { [param]: val },
			queryParamsHandling: 'merge',
		});
	}

	getQueryParamStream(param: string): Observable<string | undefined> {
		return this.route.queryParams.pipe(map(params => params[param]));
	}
}
