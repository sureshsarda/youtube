import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";

import {of} from 'rxjs';
import {HttpClient} from "@angular/common/http";

export interface Video {
    id: number;
    name: string;
    created: string;
    updated: string;
    uploader: number;
    thumbnail: string;
    path: string;
    categories: number[];
}

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    constructor(private http: HttpClient) {
    }

    getVideo(id: number): Observable<Video> {
        return this.http.get<Video>(`/api/video/${id}`)
    }

    like(id: number): Observable<any> {
        return this.http.put<any>(`/api/playlist/likes/${id}`, {})
    }

    watchLater(id: number): Observable<any> {
        return this.http.put<any>(`/api/playlist/later/${id}`, {})
    }

    getVideoCategories(): Observable<string[]> {
        return this.http.get<{ name: string }[]>('/api/categories').pipe(
            map(value => value.map(v => v.name))
        )
    }


    getVideoForList(list: string): Observable<Video[]> {
        return this.http.get<Video[]>(`/api/playlist/${list}`)
    }

    getVideosForCategory(category: string): Observable<Video[]> {
        return this.getAllVideos({category: category});
    }

    filter(keyword: string): Observable<Video[]> {
        return this.getAllVideos({query: keyword});
    }

    getAllVideos(params = {}): Observable<Video[]> {
        return this.http.get<Video[]>('/api/videos', {params})
        // return of([
        //   {
        //     "name": "Cat",
        //     "created": "2022-12-07T15:20:27.677491Z",
        //     "updated": "2022-12-07T15:20:29.438560Z",
        //     "uploader": 1,
        //     "thumbnail": "https://x21169489-mytube.s3.amazonaws.com/2/thumb.jpg",
        //     "path": "https://x21169489-mytube.s3.amazonaws.com/2/video.mp4",
        //     "categories": [
        //       1,
        //       2
        //     ]
        //   },
        //   {
        //     "name": "Cat",
        //     "created": "2022-12-07T15:21:00.036830Z",
        //     "updated": "2022-12-07T15:21:01.544856Z",
        //     "uploader": 1,
        //     "thumbnail": "https://x21169489-mytube.s3.amazonaws.com/3/thumb.jpg",
        //     "path": "https://x21169489-mytube.s3.amazonaws.com/3/video.mp4",
        //     "categories": [
        //       1,
        //       2
        //     ]
        //   }
        // ])
    }
}
