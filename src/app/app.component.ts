import { ChangeDetectorRef, Component } from '@angular/core';
import { AppState } from './store/app.state';
import { Store } from '@ngrx/store';
import { getLoading } from './store/selectors/loading.selector';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular Store';
  loading!: boolean;
  isAuthRoute = false;

  constructor(
    private store: Store<AppState>, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
   
   }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isAuthRoute = this.router.url.includes('/admin') || this.router.url.includes('/user');
    });
    this.store.select(getLoading).subscribe(loading => {
      this.loading = loading;
      this.cdr.detectChanges();
    });
  }
}
