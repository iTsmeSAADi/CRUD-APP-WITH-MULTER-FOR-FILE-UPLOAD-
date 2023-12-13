import user_model from "../models/user_db.js";

const load_index = async (req, res) => {
    const user_data = await user_model.find()
    res.render('index', {user_data});
  };
  const load_users = (req, res) => {
    res.render('add_users', {title: 'Add Users'});
  };
  
  export { load_index, load_users };