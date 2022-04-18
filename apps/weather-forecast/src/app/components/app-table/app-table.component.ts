import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
	selector: 'bp-app-table',
	templateUrl: './app-table.component.html',
	styleUrls: ['./app-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableComponent {
	@Input() header: Array<string> | null = [];
	@Input() body: (string | number)[][] | null = [[]];
}
