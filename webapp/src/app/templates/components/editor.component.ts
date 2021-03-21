import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { TemplatesState } from "../+state/templates.state";
import { safeLoad } from 'js-yaml';
import { transformTemplate } from "../templates-util";
import { UpdateDefinitionAction } from "../+state/templates.actions";

@Component({
    selector: "template-editor",
    templateUrl: "./editor.component.html"
})
export class TemplateEditorComponent implements OnInit, OnDestroy {
    loadedTemplate$: Subscription;
    model: any;
    parsed: any;
    definition: string;
    errors: any;
    mode = "EDIT";
    isDirty = false;
    constructor(public store$: Store<TemplatesState>, public activatedRoute: ActivatedRoute, public router: Router) { }

    ngOnInit(): void {
        this.loadedTemplate$ = this.store$.select(p => p.templates.loadedTemplate)
            .pipe(filter(p => p))
            .subscribe(model => {
                this.model = model;                
                this.reset();
            });
    }
    ngOnDestroy(): void {
        this.loadedTemplate$ ? this.loadedTemplate$.unsubscribe() : null;
    }

    reset = () => {
        this.definition = this.model.definition;
        this.errors = null;
        this.isDirty = false;
    }

    setDirty = () => this.isDirty = true;

    preview() {
        try {
            this.parsed = safeLoad(this.definition);
            transformTemplate(this.parsed);
            //TODO: Validate all components are present
            this.mode = 'PREVIEW';
        } catch (e) {
            this.errors = e.message;
            this.mode = 'EDIT';
        }
    }

    back() {
        this.mode = 'EDIT'
    }
    save() {
        this.isDirty = false;
        this.mode = 'EDIT';
        this.store$.dispatch(new UpdateDefinitionAction({ code: this.model.code, definition: this.definition }));
        this.router.navigate(['../overview'], { relativeTo: this.activatedRoute });
    }
}
