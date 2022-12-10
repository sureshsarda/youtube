import {Component, OnInit} from '@angular/core';
import {MegaMenuItem, MenuItem} from 'primeng/api';
import {VideoService, Video} from "./video.service";
import {Observable, of} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'mytube';


    items: MegaMenuItem[] = [
        {
            label: 'Home', icon: 'pi pi-fw pi-video', url: '/home'
        },
        {
            label: 'Liked', icon: 'pi pi-fw pi-users', url: '/lists/likes'

        },
        {
            label: 'Watch Later', icon: 'pi pi-fw pi-calendar', url: '/lists/later'

        },
        {
            label: 'Upload', icon: 'pi pi-upload', url: 'upload'
        }
    ]

    categories$: Observable<string[]> = of([]);

    play: (null | Video) = null;
    searchQuery: string = '';

    params: Params = {}

    constructor(private service: VideoService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.categories$ = this.service.getVideoCategories()

        this.activatedRoute.params.subscribe(params => {
            this.params = params;
        })
    }

}
