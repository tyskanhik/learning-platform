import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { InitializeUser } from './core/store/user.state';

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
    this.store.dispatch(new InitializeUser());
  }
}