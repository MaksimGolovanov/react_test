import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
class NoteService {
  static async fetchPosts() {
    try {
      const response = await axios.get(`${API_URL}api/notes/`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchPost(id) {
    
    try {
      const response = await axios.get(`${API_URL}api/notes/${id}`)
     
      return response.data
    } catch (error) {
      throw error;
    }
  }



  static async updatePost(id, updatedPost) {
    try {
      await axios.put(`${API_URL}api/notes/${id}`, updatedPost);
      
    } catch (error) {
      console.error("Ошибка при изменении данных:", error);
      throw error;
    }
  }


  static async createPost(post) {
    try {
      await axios.post(`${API_URL}api/notes`, post);
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      throw error;
    }
  }
  static async deletePost(id) {
    try {
      await axios.delete(`${API_URL}api/notes/${id}`);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      throw error;
    }
  }




}

export default NoteService;