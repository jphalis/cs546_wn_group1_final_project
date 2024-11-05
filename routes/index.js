// This file will import both route files and export the constructor method

import userRoutes from './users.js';

const constructorMethod = (app) => {
  app.use('/users', teamRoutes);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;