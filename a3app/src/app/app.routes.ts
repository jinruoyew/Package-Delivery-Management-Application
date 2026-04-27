import { Routes } from '@angular/router';
import { AddDriverComponent } from './components/add-driver/add-driver.component';
import { ListDriversComponent } from './components/list-drivers/list-drivers.component';
import { DeleteDriverComponent } from './components/delete-driver/delete-driver.component';
import { UpdateDriverComponent } from './components/update-driver/update-driver.component';
import { AddPackageComponent } from './components/add-package/add-package.component';
import { ListPackagesComponent } from './components/list-packages/list-packages.component';
import { DeletePackageComponent } from './components/delete-package/delete-package.component';
import { UpdatePackageComponent } from './components/update-package/update-package.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TranslateDescriptionComponent } from './components/translate-description/translate-description.component';
import { TextToSpeechComponent } from './components/text-to-speech/text-to-speech.component';
import { GenerativeAiComponent } from './components/generative-ai/generative-ai.component';
import { InvalidDataComponent } from './components/invalid-data/invalid-data.component';
import { authGuard } from './guards/auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: "dashboard", component: DashboardComponent, canActivate: [authGuard]},
    {path: "add-driver", component: AddDriverComponent, canActivate: [authGuard]},
    {path: "list-drivers", component: ListDriversComponent, canActivate: [authGuard]},
    {path: "delete-driver", component: DeleteDriverComponent, canActivate: [authGuard]},
    {path: "update-driver", component: UpdateDriverComponent, canActivate: [authGuard]},
    {path: "add-package", component: AddPackageComponent, canActivate: [authGuard]},
    {path: "list-packages", component: ListPackagesComponent, canActivate: [authGuard]},
    {path: "delete-package", component: DeletePackageComponent, canActivate: [authGuard]},
    {path: "update-package", component: UpdatePackageComponent, canActivate: [authGuard]},
    {path: "statistics", component: StatisticsComponent, canActivate: [authGuard]},
    {path: "translate", component: TranslateDescriptionComponent, canActivate: [authGuard]},
    {path: "text-to-speech", component: TextToSpeechComponent, canActivate: [authGuard]},
    {path: "generative-ai", component: GenerativeAiComponent, canActivate: [authGuard]},
    {path: "invalid-data", component: InvalidDataComponent},
    {path: "login", component: LoginComponent},
    {path: "signup", component: SignupComponent},
    {path: "**", component: PageNotFoundComponent}
];
