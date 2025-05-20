import { trigger } from '@angular/animations';
import type { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import type { SideBarLink } from '../shared/interfaces/side-bar-link';
import { UserInfo } from '../shared/interfaces/userInfo';
import { AccountService } from '../shared/services/account.service';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { expandSideBar } from './side-bar.animation';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
  providers: [AccountService],
  animations: [trigger('expandReduce', expandSideBar)],
})
export class DashBoardComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  userInfo: UserInfo | null = null;

  toggle = false;

  entityNameManaged = '...';

  slide = false;

  public links: SideBarLink[] = [
    {
      icon: 'category',
      text: $localize`:Sidebar text|Link to product categories text@@productCategories:Product Categories`,
      url: '/product-categories',
    },
    {
      icon: 'dashboard',
      text: $localize`:Sidebar text|Link to products text@@products:Products`,
      url: '/products',
    },
    {
      icon: 'store',
      text: $localize`:Sidebar text|Link to stores text@@stores:Stores`,
      url: '/stores',
    },
    {
      icon: 'group',
      text: $localize`:Sidebar text|Link to stores' users text@@storeUsers:Stores Users`,
      url: '/store-users',
    },
    {
      icon: 'format_list_numbered',
      text: $localize`:Sidebar text|Link to orders text@@orders:Orders`,
      url: '/orders',
    },
  ];

  constructor(private accountService: AccountService, private router: Router, private activateRoute: ActivatedRoute) {
    this.subscriptions.push(this.setCurrentEntity());
    this.subscriptions.push(
      this.activateRoute.data.subscribe(({ user }) => {
        this.userInfo = user;
      })
    );
  }

  setCurrentEntity() {
    return this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const currentLink = this.links.find((link) => link.url === (<NavigationEnd>event).url);

      if (currentLink?.text) {
        this.entityNameManaged = ' ' + currentLink.text.toLocaleLowerCase();
      } else {
        this.entityNameManaged = '...';
      }

      this.toggle = false;
    });
  }

  entityName(name: string) {
    this.entityNameManaged = name;
  }

  expand() {
    this.slide = true;
  }

  get isSideBarExpanded() {
    return this.slide || this.toggle;
  }

  reduce() {
    this.slide = false;
  }

  onToggled(toggle: boolean) {
    this.toggle = toggle;
  }

  logout(status: boolean) {
    if (status) {
      this.accountService.logout();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
