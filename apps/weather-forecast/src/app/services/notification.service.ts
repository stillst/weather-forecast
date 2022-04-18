import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	notifyAboutError(msg: string): void {
		alert(msg);
	}
}
