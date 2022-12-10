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

    like(id: number): Observable<Video[]> {
        return this.http.put<any>(`/api/playlist/likes/${id}`, {})
    }

    unlike(id: number): Observable<Video[]> {
        return this.http.delete<any>(`/api/playlist/likes/${id}`, {})
    }

    watchLater(id: number): Observable<Video[]> {
        return this.http.put<any>(`/api/playlist/later/${id}`, {})
    }

    removeWatchLater(id: number): Observable<Video[]> {
        return this.http.delete<any>(`/api/playlist/later/${id}`, {})
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
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`/api/video/${id}`)
    }
}
