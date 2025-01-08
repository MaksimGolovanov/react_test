import axios from 'axios';

class NoteService {
  static async fetchPosts() {
    try {
      const response = await axios.get('http://localhost:5000/api/notes/');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchPost(id) {
    
    try {
      const response = await axios.get(`http://localhost:5000/api/notes/${id}`)
     
      return response.data
    } catch (error) {
      throw error;
    }
  }



  static async updatePost(id, updatedPost) {
    try {
      await axios.put(`http://localhost:5000/api/notes/${id}`, updatedPost);
      
    } catch (error) {
      console.error("Ошибка при изменении данных:", error);
      throw error;
    }
  }


  static async createPost(post) {
    try {
      await axios.post('http://localhost:5000/api/notes', post);
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      throw error;
    }
  }
  static async deletePost(id) {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      throw error;
    }
  }




}

export default NoteService;