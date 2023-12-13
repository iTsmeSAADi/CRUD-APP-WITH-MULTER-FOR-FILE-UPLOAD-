import user_model from "../models/user_db.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

class UserController {

  static fetchData = async (req, res) => {
    try {
      const data = await user_model.find({});
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  static add_user = async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const { filename } = req.file;

      if (name && email && phone && filename) {
        // Check if a user with the same email already exists
        const existingUser = await user_model.findOne({ email: email });

        if (!existingUser) {
          // Convert the import.meta.url to a file path
          const currentFilePath = fileURLToPath(import.meta.url);
          const currentDirPath = dirname(currentFilePath);

          // Adjust the path based on your folder structure
          const imagePath = join(currentDirPath, '..', 'uploads', filename);

          const doc = user_model({
            name: name,
            email: email,
            phone: phone,
            image: imagePath,
          });

          await doc.save();

          res.status(200).json({
            SUCCESS: true,
            MESSAGE: 'USER SAVED SUCCESSFULLY',
            SAVED: doc,
          });
        } else {
          res.status(400).json({
            SUCCESS: false,
            MESSAGE: 'USER ALREADY EXISTS',
            ERROR_DESCRIPTION: 'A user with the same email already exists.',
          });
        }
      } else {
        res.status(400).json({
          SUCCESS: false,
          MESSAGE: 'INVALID INPUT',
          ERROR_DESCRIPTION: 'Name, email, phone, and filename are required.',
        });
      }
    } catch (error) {
      res.status(500).json({
        SUCCESS: false,
        MESSAGE: 'USER NOT SAVED',
        ERROR_DESCRIPTION: error.message,
      });
    }
  };

  static update_user = async (req, res) => {
    const { update_name, update_email, update_phone } = req.body;
    const { id } = req.params;
  
    try {
      // Find the existing user by ID
      const existing_user = await user_model.findById(String(id));
  
      // Check if the user exists
      if (!existing_user) {
        return res.status(404).json({
          SUCCESS: false,
          MESSAGE: 'USER NOT FOUND',
          ERROR_DESCRIPTION: 'User with the provided ID not found.',
        });
      }
  
      // Update only the fields that are provided and not empty
      if (update_name !== undefined && update_name !== '') existing_user.name = update_name;
      if (update_email !== undefined && update_email !== '') existing_user.email = update_email;
      if (update_phone !== undefined && update_phone !== '') existing_user.phone = update_phone;
  
      // Check if any of the fields is empty
      if (update_name === '') {
        return res.status(400).json({
          SUCCESS: false,
          MESSAGE: 'INVALID INPUT',
          ERROR_DESCRIPTION: 'Name cannot be empty.',
        });
      }
  
      if (update_email === '') {
        return res.status(400).json({
          SUCCESS: false,
          MESSAGE: 'INVALID INPUT',
          ERROR_DESCRIPTION: 'Email cannot be empty.',
        });
      }
  
      if (update_phone === '') {
        return res.status(400).json({
          SUCCESS: false,
          MESSAGE: 'INVALID INPUT',
          ERROR_DESCRIPTION: 'Phone cannot be empty.',
        });
      }
  
      // Save the updated user
      await existing_user.save();
  
      return res.status(200).json({
        SUCCESS: true,
        MESSAGE: 'USER UPDATED SUCCESSFULLY',
        UPDATED_USER: existing_user,
      });
    } catch (error) {
      res.status(500).json({
        SUCCESS: false,
        MESSAGE: 'USER UPDATE FAILED',
        ERROR_DESCRIPTION: error.message,
      });
    }
  };
  
  static delete_user = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the user exists
      const existing_user = await user_model.findById(id);
      if (!existing_user) {
        return res.status(404).json({
          SUCCESS: false,
          MESSAGE: 'USER NOT FOUND',
          ERROR_DESCRIPTION: 'User with the provided ID not found.',
        });
      }
  
      // Perform the delete operation
      const deleted_user = await user_model.findByIdAndDelete(id);
  
      // Check if the user was successfully deleted
      if (!deleted_user) {
        return res.status(500).json({
          SUCCESS: false,
          MESSAGE: 'USER DELETE FAILED',
          ERROR_DESCRIPTION: 'Error deleting the user.',
        });
      }
  
      // Provide a success response
      res.status(200).json({
        SUCCESS: true,
        MESSAGE: 'USER DELETED SUCCESSFULLY',
        DELETED_USER: deleted_user,
      });
    } catch (error) {
      // Handle any unexpected errors
      res.status(500).json({
        SUCCESS: false,
        MESSAGE: 'USER DELETE FAILED',
        ERROR_DESCRIPTION: error.message,
      });
    }
  };
  
}



export default UserController;
