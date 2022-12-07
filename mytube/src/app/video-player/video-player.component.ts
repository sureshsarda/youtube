import {Component, OnInit} from '@angular/core';
import {Video, VideoService} from "../video.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, of} from "rxjs";

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

    video$: Observable<Partial<Video>> = of({})

    constructor(private service: VideoService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            const id = params['videoId']
            this.video$ = this.service.getVideo(id)
        })
    }

    onLike(video: Partial<Video>) {
        this.service.like(video.id as number).subscribe(res => {
            console.log('video liked');
        })
    }

    onWatchLater(video: Partial<Video>) {
        this.service.watchLater(video.id as number).subscribe(res => {
            console.log('video added to watch later');
        })
    }
}
