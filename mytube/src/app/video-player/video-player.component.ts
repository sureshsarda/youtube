import {Component, OnInit} from '@angular/core';
import {Video, VideoService} from "../video.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of} from "rxjs";

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

    video$: Observable<Video> | null = null;

    likes: Set<number> = new Set();
    later: Set<number> = new Set();

    constructor(private service: VideoService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            const id = params['videoId']
            this.video$ = this.service.getVideo(id)
        })

        this.service.getVideoForList('likes').subscribe(videos => {
            this.likes = new Set(videos.map(v => v.id))
        })

        this.service.getVideoForList('later').subscribe(videos => {
            this.later = new Set(videos.map(v => v.id))
        })
    }

    onLike(video: Partial<Video>) {
        this.service.like(video.id as number).subscribe(videos => {
            this.likes = new Set(videos.map(v => v.id))
        })
    }

    onWatchLater(video: Partial<Video>) {
        this.service.watchLater(video.id as number).subscribe(videos => {
            this.later = new Set(videos.map(v => v.id))
        })
    }

    onLikeRemove(video: Partial<Video>) {
        this.service.unlike(video.id as number).subscribe(videos => {
            this.likes = new Set(videos.map(v => v.id))
        })
    }

    onWatchLaterRemove(video: Partial<Video>) {
        this.service.removeWatchLater(video.id as number).subscribe(videos => {
            this.later = new Set(videos.map(v => v.id))
        })
    }

    onDelete(video: Video) {
        this.service.delete(video.id).subscribe(res => {
            this.router.navigateByUrl('/home')
        })
    }
}
