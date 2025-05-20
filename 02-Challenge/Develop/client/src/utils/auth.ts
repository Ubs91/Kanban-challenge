import { JwtPayload, jwtDecode } from 'jwt-decode';

interface AuthTokenPayload extends JwtPayload {
  username: string;
  id: string;
  exp: number;
}

class AuthService {
  getProfile() {
    // Return the decoded token
    const token = this.getToken();
    return token ? jwtDecode<AuthTokenPayload>(token) : null;
  }

  loggedIn() {
    // Check if there is a token and it's not expired
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<AuthTokenPayload>(token);
      // Check if the token expiration time is less than the current time
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      // If there's an error decoding the token, consider it expired
      return true;
    }
  }

  getToken(): string {
    // Retrieve the token from localStorage
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    // Save token to localStorage
    localStorage.setItem('id_token', idToken);
    
    // Redirect to the home page
    window.location.assign('/');
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    
    // Redirect to the login page
    window.location.assign('/login');
  }
}

export default new AuthService();
