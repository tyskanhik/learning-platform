import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserActions from './core/store/user/user.actions';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('learning-platform');
  private store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(UserActions.initializeUser());
  }
}
