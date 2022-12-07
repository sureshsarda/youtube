import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {MegaMenuModule} from 'primeng/megamenu';

import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';


import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {CardModule} from "primeng/card";
import {ImageModule} from 'primeng/image';
import {VideoListerComponent} from './video-lister/video-lister.component';
import {VideoPlayerComponent} from './video-player/video-player.component';
import {HttpClientModule} from "@angular/common/http";
import {ChipModule} from 'primeng/chip';
import {AvatarModule} from 'primeng/avatar';
import { UploadComponent } from './upload/upload.component';
import {FileUploadModule} from 'primeng/fileupload';
import {ChipsModule} from "primeng/chips";


@NgModule({
    declarations: [
        AppComponent,
        VideoListerComponent,
        VideoPlayerComponent,
        UploadComponent
    ],
    imports: [
        MegaMenuModule,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        RadioButtonModule,
        RippleModule,
        FormsModule,
        ImageModule,
        CardModule,
        BrowserModule,
        HttpClientModule,
        ChipModule,
        AvatarModule,
        FileUploadModule,
        RouterModule.forRoot([
            {path: 'home', component: VideoListerComponent},
            {path: 'video/:videoId', component: VideoPlayerComponent},
            {path: 'upload', component: UploadComponent},
            {path: ':type/:name', component: VideoListerComponent},
            {path: '', pathMatch: 'full', redirectTo: 'home'},
        ]),
        ChipsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
