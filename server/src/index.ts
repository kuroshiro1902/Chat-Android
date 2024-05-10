import 'dotenv/config';
import env from './env';

import server from './servers';
// import database from './database';
import io from './servers/io';

// database.listen(env.DB_PORT, () => {
//   console.log('Database listening on port ' + env.DB_PORT);
// });

io.run();

server.listen(env.PORT, () => {
  console.log('Server listening on port ' + env.PORT);
});
