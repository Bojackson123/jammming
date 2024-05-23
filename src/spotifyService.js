import axios from 'axios';

class SpotifyService {
  constructor() {
      this.accessToken = null;
      this.tokenExpiry = null;
      this.clientId = '0147af87650b4d0a9b79ce5996311e55';
      this.redirectUri = 'http://localhost:3000/'//'https://jammming-sounds.vercel.app/'; 
      this.scopes = 'playlist-modify-public';
  }

  setAccessToken(token, expiresIn) {
      this.accessToken = token;
      this.tokenExpiry = new Date().getTime() + expiresIn * 1000; // Store expiry time in milliseconds
      localStorage.setItem('spotify_access_token', token);
      localStorage.setItem('spotify_token_expiry', this.tokenExpiry);
  }

  getAccessToken() {
      if (this.accessToken && this.tokenExpiry && new Date().getTime() < this.tokenExpiry) {
          return this.accessToken;
      }

      const storedToken = localStorage.getItem('spotify_access_token');
      const storedExpiry = localStorage.getItem('spotify_token_expiry');
      if (storedToken && storedExpiry && new Date().getTime() < storedExpiry) {
          this.accessToken = storedToken;
          this.tokenExpiry = storedExpiry;
          return storedToken;
      }

      const hash = window.location.hash;
      if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const expiresIn = params.get('expires_in');
          if (accessToken && expiresIn) {
              this.setAccessToken(accessToken, expiresIn);
              window.location.hash = '';
              return accessToken;
          }
      }

      return null;
  }

  authorize() {
      const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${this.clientId}&scope=${encodeURIComponent(this.scopes)}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
      window.location.href = authUrl;
  }

  async search(query, type) {
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`;
      const headers = {
          'Authorization': `Bearer ${this.getAccessToken()}`
      };

      try {
          const response = await axios.get(url, { headers });
          return response.data;
      } catch (error) {
          if (error.response.status === 401) {
              this.authorize();
          }
          console.error('Error searching:', error);
      }
  }

  async getAlbumTracks(albumId) {
      const url = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
      const headers = {
          'Authorization': `Bearer ${this.getAccessToken()}`
      };

      try {
          const response = await axios.get(url, { headers });
          return response.data.items;
      } catch (error) {
          if (error.response.status === 401) {
              this.authorize();
          }
          console.error('Error fetching album tracks:', error);
      }
  }

  async createPlaylist(userId, name) {
      const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
      const headers = {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json'
      };
      const data = {
          name: name,
          public: true
      };

      try {
          const response = await axios.post(url, data, { headers });
          return response.data.id;;
      } catch (error) {
          if (error.response.status === 401) {
              this.authorize();
          }
          console.error('Error creating playlist:', error);
      }
  }

  async addTracksToPlaylist(playlistId, trackUris) {
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      const headers = {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json'
      };
      const data = {
          uris: trackUris
      };

      try {
          await axios.post(url, data, { headers });
          console.log('Tracks added to playlist');
      } catch (error) {
          if (error.response.status === 401) {
              this.authorize();
          }
          console.error('Error adding tracks to playlist:', error);
      }
  }

  async getUserProfile() {
      const url = 'https://api.spotify.com/v1/me';
      const headers = {
          'Authorization': `Bearer ${this.getAccessToken()}`
      };

      try {
          const response = await axios.get(url, { headers });
          return response.data;
      } catch (error) {
          if (error.response.status === 401) {
              this.authorize();
          }
          console.error('Error fetching user profile:', error);
      }
  }

  async getArtistTopTracks(artistId) {
    const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
    const headers = {
        'Authorization': `Bearer ${this.getAccessToken()}`
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.tracks;
    } catch (error) {
        if (error.response.status === 401) {
            this.authorize();
        }
        console.error('Error fetching artist top tracks:', error);
    }
}

  
}

    
  
  const spotifyService = new SpotifyService();
  export default spotifyService;