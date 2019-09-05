

export default function ({ store, redirect }) {
    /*
    if (process.server) {
        var admin = require('firebase-admin');
        let isInit = false;
        let app = null
        if (!isInit) {
            app = admin.initializeApp();
            isInit = true;
        } else {
            app =  admin.app()
        }
        console.log('#1')
        app.auth().listUsers(1000)
        .then((listUsersResult) => {
          let users = []
          console.log('#2')
          listUsersResult.users.forEach((userRecord) => {
            console.log('user', userRecord.toJSON().email);
            users.push('bidule')
            store.dispatch('users/add', { name: userRecord.toJSON().email })
            //context.store.commit('addUser', userRecord.toJSON().email)
            //res.write(userRecord + '; ')
          });
          store.dispatch('users/add', { name: users[0] })
          console.log('test', store.state.users.userList)
          //res.end()
          //if (listUsersResult.pageToken) {
          //  // List next batch of users.
          //  listAllUsers(listUsersResult.pageToken);
          //}
        })
        .catch(function(error) {
          console.log('Error listing users:', error);
        });
        console.log('added user');
        store.dispatch('users/add', { name: 'truc2' })
        store.dispatch('users/add', { name: 'truc3' })
    }
    */
}
