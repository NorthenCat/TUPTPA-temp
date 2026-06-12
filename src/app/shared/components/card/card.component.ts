import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { AnimationBuilder, AnimationService } from 'css-animator';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('collapsedCard', [
      state('collapsed, void',
        style({
          overflow: 'hidden',
          height: '2px',
        })
      ),
      state('expanded',
        style({
          overflow: 'hidden',
          height: AUTO_STYLE,
        })
      ),
      transition('collapsed <=> expanded', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('cardRemove', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0,
        display: 'none'
      })),
      transition('open <=> closed', animate('400ms')),
    ])
  ]
})

export class CardComponent implements OnInit {
  @Input() isRector: boolean;
  @Input() loading: boolean;
  @Input() cardTitle: string;
  @Input() cardClass: string;
  @Input() addClass: string;
  @Input() blockClass: string;
  @Input() headerClass: string;
  @Input() options: boolean;
  @Input() hidHeader: boolean;
  @Input() iconHeader: string;
  @Input() customHeader: boolean;
  @Input() cardCaption: string;
  @Input() captionClass: string;
  @Input() isCardFooter: boolean;
  @Input() footerClass: string;
  @Input() isCollapseMenu: boolean;
  @Input() isCollapsedCard: boolean;
  @Input() isSkeleton: boolean;

  public animation: string;
  public fullIcon: string;
  public isAnimating: boolean;
  public animator: AnimationBuilder;
  public animators: AnimationBuilder;

  public collapsedCard: string;
  public collapsedIcon: string;

  public loadCard: boolean;

  public cardRemove: string;
  public lang: string;

  constructor(
    broadcasterService: BroadcasterService,
    translateService: TranslateService,
    animationService: AnimationService,
    config: NgbDropdownConfig
  ) {
    config.placement = 'bottom-right';
    this.customHeader = false;
    this.options = false;
    this.hidHeader = false;
    this.isCardFooter = false;
    this.cardTitle = '';
    this.isRector = false;
    this.isCollapseMenu = false;
    this.isSkeleton = true;

    this.animator = animationService.builder();
    this.animators = animationService.builder();
    this.animator.useVisibility = true;
    this.fullIcon = 'icon-maximize';
    this.isAnimating = false;

    this.collapsedCard = 'expanded';
    this.collapsedIcon = 'icofont icofont-rounded-up';

    this.loading = false;
    this.loadCard = false;

    this.cardRemove = 'open';

    this.lang = localStorage.getItem('lang');
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
  }

  ngOnInit() {
    if (this.isCollapsedCard) {
      this.collapsedCard = 'collapsed';
      this.collapsedIcon = 'icofont icofont-rounded-down';
    }
    if (this.hidHeader) {
      this.options = false;
    }

    if (!this.options || this.hidHeader || this.customHeader) {
      this.collapsedCard = 'false';
    }
  }

  public loadingCard(param): void {
    if (param) {
      this.loadCard = true;
      this.cardClass = 'card-load';
    } else {
      this.cardClass = 'expanded';
      this.loadCard = false;
    }
  }

  public fullCardToggle(element: HTMLElement, animation: string, status: boolean) {
    animation = this.cardClass === 'full-card' ? 'zoomOut' : 'zoomIn';
    this.fullIcon = this.cardClass === 'full-card' ? 'icon-maximize' : 'icon-minimize';
    // const duration = this.cardClass === 'full-card' ? 300 : 600;
    this.cardClass = this.cardClass === 'full-card' ? this.cardClass : 'full-card';
    if (status) {
      this.animation = animation;
    }
    this.isAnimating = true;

    this.animators
      .setType(this.animation)
      .setDuration(500)
      .setDirection('alternate')
      .setTimingFunction('cubic-bezier(0.1, -0.6, 0.2, 0)')
      .animate(element)
      .then(() => {
        this.isAnimating = false;
      })
      .catch(() => {
        this.isAnimating = false;
      });
    setTimeout(() => {
      this.cardClass = animation === 'zoomOut' ? '' : this.cardClass;
      if (this.cardClass === 'full-card') {
        document.querySelector('body').style.overflow = 'hidden';
      } else {
        document.querySelector('body').removeAttribute('style');
      }
    }, 500);
  }

  collapsedCardToggle() {
    this.collapsedCard = this.collapsedCard === 'collapsed' ? 'expanded' : 'collapsed';
    this.collapsedIcon = this.collapsedCard === 'collapsed' ? 'icofont icofont-rounded-down' : 'icofont icofont-rounded-up';
  }

  cardRefresh() {
    this.loadCard = true;
    this.cardClass = 'card-load';
    setTimeout( () => {
      this.loadCard = false;
      this.cardClass = 'expanded';
    }, 3000);
  }

  cardRemoveAction() {
    this.cardRemove = this.cardRemove === 'closed' ? 'open' : 'closed';
  }

}
