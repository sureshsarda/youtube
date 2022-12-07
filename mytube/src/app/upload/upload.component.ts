import {Component, OnInit} from '@angular/core';
import {HttpEventType, HttpProgressEvent} from "@angular/common/http";

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

    categories: string[] = [];
    name: string = ''
    showProgress = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    onBeforeUpload($event: { formData: FormData }) {
        $event.formData.set('payload', JSON.stringify({
            'name': this.name,
            'categories': this.categories
        }))
        this.showProgress = true;
    }

    onHideProgress() {
        this.showProgress = false;

    }
}
