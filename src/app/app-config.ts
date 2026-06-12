export class DefaultConfig {
  public static Application = {
    appName: 'satu-framework' // set Application name
  };
  public static config = {
    layout: 'vertical', // vertical, horizontal
    subLayout: '', // horizontal-2
    collapseMenu: false,
    layoutType: 'menu-light', // menu-dark, menu-light, dark
    headerBackColor: 'background-img-1', // background-blue, background-red, background-purple, background-info, background-dark
    rtlLayout: false,
    navFixedLayout: true,
    headerFixedLayout: false,
    boxLayout: false,
    breadcumb: true,
  };
  public static lang = {
    defaultLang: 'id' // set default languange for all component
  };
}
