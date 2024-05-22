import axios from 'axios';

class SpotifyService {
    constructor() {
        this.clientId = '0147af87650b4d0a9b79ce5996311e55'; // Replace with your Spotify client ID
        this.redirectUri = 'https://jammming-sounds.vercel.app/'; // Replace with your redirect URI
        this.scopes = 'playlist-modify-public';
        this.accessToken = null;
        this.refreshToken = null;
        this.codeVerifier = null;
    }

    // Generate a secure random string for the PKCE challenge
    generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    // Generate code challenge from verifier
    async generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
        return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    // Store tokens in local storage to maintain session state
    setTokens(accessToken, refreshToken = null) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('spotify_access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('spotify_refresh_token', refreshToken);
        }
    }

    // Start authorization process
    async authorize() {
        this.codeVerifier = this.generateRandomString(128);
        const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
        const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&scope=${encodeURIComponent(this.scopes)}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
        window.location.href = authUrl;
    }

    // Retrieves the access token from internal state or local storage
    getAccessToken() {
      if (this.accessToken) {
          return this.accessToken;
      }

      const storedAccessToken = localStorage.getItem('spotify_access_token');
      if (storedAccessToken) {
          this.accessToken = storedAccessToken;
          return storedAccessToken;
      }

      return null;
    }

    // Fetch access token using authorization code
    async fetchAccessToken(code) {
        console.log('Attempting to fetch access token with code:', code);
        const url = 'https://accounts.spotify.com/api/token';
        const data = {
            client_id: this.clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.redirectUri,
            code_verifier: this.codeVerifier,
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        try {
            const response = await axios.post(url, new URLSearchParams(data), { headers });
            console.log('Token response:', response.data);
            this.setTokens(response.data.access_token, response.data.refresh_token);
            window.history.pushState({}, null, "/"); // Clear the code from the URL
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    }

    async refreshToken() {
      const url = 'https://accounts.spotify.com/api/token';
      const data = {
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.clientId
      };
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
      };
  
      try {
          const response = await axios.post(url, new URLSearchParams(data), { headers });
          console.log('Refresh token response:', response.data);  // Debug log
          this.setTokens(response.data.access_token);  // Assume refresh token is not returned
      } catch (error) {
          console.error('Error refreshing access token:', error);
          throw new Error('Failed to refresh token'); // Handle this exception in your calling function
      }
  }
  
  async makeAuthorizedRequest(url, method = 'GET', data = null) {
      if (!this.accessToken && localStorage.getItem('spotify_access_token')) {
          this.accessToken = localStorage.getItem('spotify_access_token');
      }
  
      console.log('Using access token:', this.accessToken);  // Debug log
  
      const headers = {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
      };
  
      try {
          const response = await axios({ url, method, headers, data });
          return response.data;
      } catch (error) {
          console.log('Failed request with token:', this.accessToken);  // Debug log
          if (error.response && error.response.status === 401) {
              await this.refreshToken();
              console.log('New access token after refresh:', this.accessToken);  // Debug log
              return this.makeAuthorizedRequest(url, method, data);  // Retry the request with new token
          } else {
              console.error('Error making authorized request:', error);
              throw error;  // Rethrow the error if it's not a 401
          }
      }
  }

    // Retrieve user profile information from Spotify
    async getUserProfile() {
      const url = 'https://api.spotify.com/v1/me';
      return this.makeAuthorizedRequest(url);
  }

    // Example method: search tracks, albums, artists
    async search(query) {
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album,artist`;
        return this.makeAuthorizedRequest(url);
    }

    // Example method: get album tracks
    async getAlbumTracks(albumId) {
        const url = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
        return this.makeAuthorizedRequest(url);
    }

    // Example method: create a playlist
    async createPlaylist(userId, name) {
        const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
        const data = {
            name: name,
            public: true
        };
        return this.makeAuthorizedRequest(url, 'POST', data);
    }

    // Example method: add tracks to a playlist
    async addTracksToPlaylist(playlistId, trackUris) {
        const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const data = {
            uris: trackUris
        };
        await this.makeAuthorizedRequest(url, 'POST', data);
    }
}

const spotifyService = new SpotifyService();
export default spotifyService;