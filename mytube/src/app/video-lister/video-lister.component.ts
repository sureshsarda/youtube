import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Video, VideoService} from "../video.service";
import {Observable, of} from "rxjs";

@Component({
    selector: 'app-video-lister',
    templateUrl: './video-lister.component.html',
    styleUrls: ['./video-lister.component.css']
})
export class VideoListerComponent implements OnInit {

    params: any;
    data: any;

    videos$: Observable<Video[]> = of([])

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private service: VideoService) {
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {
            console.log('params', params)
            if (params['type'] === 'lists') {
                const name = params['name']
                this.videos$ = this.service.getVideoForList(name)
            } else if (params['type'] === 'categories') {
                const name = params['name']
                this.videos$ = this.service.getVideosForCategory(name)
            } else {
                this.videos$ = this.service.getAllVideos();
            }
        })

        this.activatedRoute.queryParams.subscribe(params => {
            if (params['query'] && params['query'] !== '') {
                this.videos$ = this.service.filter(params['query']);
            }
        })

        this.activatedRoute.data.subscribe(urls => {
            this.data = urls
        })
    }

}
