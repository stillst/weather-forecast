import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FilterValue } from './interface';

@Component({
	selector: 'bp-app-table-filters',
	templateUrl: './app-table-filters.component.html',
	styleUrls: ['./app-table-filters.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableFiltersComponent implements OnInit {
	@Input() set text(val: string | null) {
		val && this.forecastForm?.controls.text.setValue(val);
	}

	@Input() set selectedOption(val: string | null) {
		if (val && this.options.includes(val)) {
			this.forecastForm?.controls.select.setValue(val.toLowerCase());
		}
	}

	@Input() options: Array<string> = [];

	@Output() formSubmit = new EventEmitter<FilterValue>();
	@Output() selectChanged = new EventEmitter<string>();
	@Output() formError = new EventEmitter<void>();

	forecastForm!: FormGroup;

	ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.forecastForm = new FormGroup({
			text: new FormControl('', [Validators.minLength(3)]),
			select: new FormControl(this.options[0] || ''),
		});
	}

	onSelectChange(): void {
		this.selectChanged.next(this.forecastForm.controls.select.value);
	}

	onSubmit(): void {
		if (this.forecastForm.status === 'INVALID') {
			this.formError.next();
			return;
		}

		this.formSubmit.next(this.forecastForm.value);
	}
}
