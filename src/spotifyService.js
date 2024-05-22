import axios from 'axios';

class SpotifyService {
    constructor() {
      this.accessToken = null;
      this.clientId = '0147af87650b4d0a9b79ce5996311e55'; // Replace with your Spotify client ID
      this.redirectUri = 'https://jammming-sounds.vercel.app/'; // Replace with your redirect URI
      this.scopes = 'playlist-modify-public';
    }
  
    setAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem('spotify_access_token', token);
    }
  
    getAccessToken() {
      // Check if the access token is already present in the instance or in the local storage
      if (this.accessToken) {
        return this.accessToken;
      }
  
      const storedToken = localStorage.getItem('spotify_access_token');
      if (storedToken) {
        this.accessToken = storedToken;
        return storedToken;
      }
  
      // Check the URL for the access token
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        if (accessToken) {
          this.setAccessToken(accessToken);
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
  
    async search(query) {
      const url = `https://api.spotify.com/v1/search?q=${query}&type=track,album,artist`;
      const headers = {
        'Authorization': `Bearer ${this.getAccessToken()}`
      };
  
      try {
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
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
        return response.data;
      } catch (error) {
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
            console.error('Error fetching user profile:', error);
        }
    }
    
  }

    
  
  const spotifyService = new SpotifyService();
  export default spotifyService;