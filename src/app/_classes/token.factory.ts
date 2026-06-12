export class TokenFactory {
  public scope: Array<any>;
  public lang: string;
  public credentials: {
    token: string,
    expires_in: number
  };
  public layoutType: string;

  constructor() {
    this.lang = null;
    this.credentials = {
      token: null,
      expires_in: null
    };
    this.scope = [];
  }

  setAccessToken(args) {
    this.credentials = {
      token: args.token,
      expires_in: args.expired
    };
    localStorage.setItem('token', JSON.stringify(this.credentials));
  }

  setScope(args) {
    localStorage.setItem('scope', JSON.stringify(args));
  }

  setProfileSatu(args) {
    localStorage.setItem('profile_satu', JSON.stringify(args));
  }

  setLang(lang) {
    localStorage.setItem('lang', lang);
  }

  retrieveAccessToken() {
    let storedToken: any;
    let token: any;
    const storedUserData: string = localStorage.getItem('token');
    if (!storedUserData) {
      return false;
    }
    try {
      storedToken = JSON.parse(storedUserData);
      token = storedToken;
    } catch (error) {
      console.error(error);
      this.destroyToken();
      return false;
    }
    return token;
  }

  retrieveProfile() {
    let storedProfile: any;
    let profile: any;
    const storedProfileData = localStorage.getItem('profile_satu');
    if (!storedProfileData) {
      return false;
    }
    try {
      storedProfile = JSON.parse(storedProfileData);
      profile = storedProfile;
    } catch (error) {
      console.error(error);
      this.destroyProfile();
      return false;
    }
    return profile;
  }

  retrieveScope() {
    let storedScope: any;
    let scope: any;
    const storedScopeData = localStorage.getItem('scope');
    if (!storedScopeData) {
      return false;
    }
    try {
      storedScope = JSON.parse(storedScopeData);
      scope = storedScope;
    } catch (error) {
      console.error(error);
      this.destroyScope();
      return false;
    }
    return scope;
  }

  retrieveRefreshToken() {
    let storedToken: any;
    let token: any;
    const storedUserData: string = localStorage.getItem('token');
    if (!storedUserData) {
      return false;
    }
    try {
      storedToken = JSON.parse(storedUserData);
      token = storedToken;
    } catch (error) {
      console.error(error);
      this.destroyToken();
      return false;
    }
    return token;
  }

  destroyToken() {
    const storedUserData: string = localStorage.getItem('token');
    if (storedUserData) {
      localStorage.removeItem('token');
      this.destroyScope();
      this.destroyProfile();
      return true;
    }
  }

  destroyProfile() {
    const storedProfileData: string = localStorage.getItem('profile_satu');
    if (storedProfileData) {
      localStorage.removeItem('profile_satu');
      return true;
    }
  }

  destroyScope() {
    const storedScopeData: string = localStorage.getItem('scope');
    if (storedScopeData) {
      localStorage.removeItem('scope');
      return true;
    }
  }
}
