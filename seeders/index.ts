import models from '../src/models'
import {hashSync,genSaltSync} from 'bcryptjs'
import auth from "../src/config/auth"
const {users,roles,sequelize} = models

const rolesSeed = [
    { id:0,name: 'Student' },
    { id:1,name: 'Teacher' },
  ];
  let passwordHash=hashSync('admin123',genSaltSync(auth.rounds))
  const usersSeed = [
    { password: passwordHash, rol_id: 1 , email:"admin@gmail.com",last_name:"admin",active_status:true,name:"admin"}
    
  ];

  async function seedDatabase() {
    const transaction = await sequelize.transaction();
    try {
      await roles.bulkCreate(rolesSeed, { transaction });
      await users.bulkCreate(usersSeed, { transaction });
  
      await transaction.commit();
  
      console.log('Datos poblados con éxito');
    } catch (error) {
      console.error('Error al poblar la base de datos: ', error);
      if (transaction) await transaction.rollback();
      throw Error("Hubo un error en la transaccion")
    } finally {
      // Cerrar la conexión a la base de datos
      await sequelize.close();
      console.log('Conexión a la base de datos cerrada.');
    }
  }
  
  seedDatabase()
    .then(() => {
      console.log('Seeding completo.');
      process.exit();  // Cierra el proceso de Node.js
    })
    .catch((err) => {
      console.error('Seeding fallido:', err);
      process.exit(1);  // Cierra el proceso de Node.js con error
    });