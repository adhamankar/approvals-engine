import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgTruncatePipeModule } from 'angular-pipes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { templatesReducer } from './+state/templates.reducer';
import { templatesInitialState } from './+state/templates.init';
import { TemplatesEffects } from './+state/templates.effects';
import { TemplateListComponent } from './components/list.component';
import { TemplateDetailsComponent } from './components/details.component';
import { NgxMdModule } from 'ngx-md';
import { SidebarModule } from 'primeng/sidebar';
import { TemplateDefinitionComponent } from './components/definition.component';
import { TemplateEvaluatorComponent } from './components/evaluate.component';

const routes: Route[] = [
  { path: 'templates', component: TemplateListComponent },
  {
    path: ':code', component: TemplateDetailsComponent, children: [
      { path: 'definition', component: TemplateDefinitionComponent },
      { path: 'evaluate', component: TemplateEvaluatorComponent }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'templates' }
];

const components = [TemplateListComponent, TemplateDetailsComponent, TemplateDefinitionComponent, TemplateEvaluatorComponent];
@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    NgTruncatePipeModule,
    NgxMdModule,
    SidebarModule,

    FontAwesomeModule,

    StoreModule.forFeature("templates", templatesReducer, { initialState: templatesInitialState }),
    EffectsModule.forFeature([TemplatesEffects]),

    RouterModule.forChild(routes)
  ]
})
export class TemplatesModule { }
