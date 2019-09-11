var admin = require('firebase-admin');
let isInit = false;

module.exports = function (req, res, next) {
    console.log('called URL : ', req.originalUrl);
    /*
        /api/v1/adminusers --> JSON des data
        /api/v1/adminusers/create --> JSON { success: true/false, error: null/string, insertedId: '' }
        /api/v1/adminusers/update --> JSON { success: true/false, error: null/string }
    */
    let app = null
    if (!isInit) {
        app = admin.initializeApp();
        isInit = true;
    } else {
        app = admin.app()
    }
    if (req.originalUrl == '/api/v1/adminusers') {
        let body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) req.connection.destroy();
        })
        req.on('end', function () {
            body = JSON.parse(body)
            admin.auth().verifyIdToken(body)
            .then(function(decodedToken) {
                let uid = decodedToken.uid;
                admin.auth().getUser(uid)
                .then(function(userRecord) {
                    if (userRecord.toJSON().customClaims.status == 'admin') {
                        app.auth().listUsers(1000)
                            .then(function(listUsersResult) {
                                res.setHeader('content-type', 'application/json');
                                res.write('{"success": "true", "content": [');
                                let isFirst = true
                                listUsersResult.users.forEach(function(userRecord) {
                                    // console.log('user', userRecord.toJSON());
                                    if (!isFirst) {
                                        res.write(',')
                                    }
                                    isFirst = false
                                    res.write(JSON.stringify(userRecord.toJSON()))
                                });
                                res.write(']}');
                                res.end();
                                //if (listUsersResult.pageToken) {
                                //  // List next batch of users.
                                //  listAllUsers(listUsersResult.pageToken);
                                //}
                            })
                            .catch(function(error) {
                                res.write('{ "success": "false", "error": "' + error + '" }');
                                res.end();
                            });
                    } else {
                        res.write('{"success": "true", "content": [' + JSON.stringify(userRecord.toJSON()) + ']}');
                        res.end();
                    }
                })
                .catch(function(error) {
                    res.write('{ "success": "false", "error": "' + error + '" }');
                    res.end();
                });
            }).catch(function(error) {
                res.write('{ "success": "false", "error": "' + error + '" }');
                res.end();
            });
        });
        req.on('error', function (e) {
            console.log('error', e.message);
            res.write('{ "success": "false", "error": "' + e.message + '" }');
            res.end();
        });
    } else if (req.originalUrl == '/api/v1/adminusers/update') {
        let body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) req.connection.destroy();
        })
        req.on('end', function () {
            body = JSON.parse(body)
            console.log('request body: ', body);
            admin.auth().verifyIdToken(body.token)
            .then(function(decodedToken) {
                let uid = decodedToken.uid;
                admin.auth().getUser(uid)
                .then(function(userRecord) {
                    console.log('Successfully fetched user status:', userRecord.toJSON().customClaims.status);
                    if (userRecord.toJSON().customClaims.status == 'admin') {
                        admin.auth().updateUser(body.uid, body.content)
                        .then(function(userRecord) {
                            console.log('Successfully updated user', userRecord.toJSON());
                            admin.auth().setCustomUserClaims(body.uid, body.claims)
                            .then(function() {
                                console.log('Successfully set user claims: ', body.claims);
                                res.write('{ "success": "true", "insertedId": "' + body.uid + '" }');
                                res.end();
                            })
                            .catch(function(error) {
                                console.log('Error setting user claims:', error);
                                res.write('{ "success": "false", "error": "' + error + '" }');
                                res.end();
                            });
                        })
                        .catch(function(error) {
                            console.log('Error updating user:', error);
                            res.write('{ "success": "false", "error": "' + error + '" }');
                            res.end();
                        });
                    } else if (uid == body.uid) {
                        admin.auth().updateUser(body.uid, body.content)
                        .then(function(userRecord) {
                            console.log('Successfully updated user', userRecord.toJSON());
                            res.write('{ "success": "true", "insertedId": "' + body.uid + '" }');
                            res.end();
                        })
                        .catch(function(error) {
                            console.log('Error updating user:', error);
                            res.write('{ "success": "false", "error": "' + error + '" }');
                            res.end();
                        });
                    } else {
                        res.write('{ "success": "false", "error": "User doesn\'t meet the required permissions" }');
                        res.end();
                    }
                })
                .catch(function(error) {
                    res.write('{ "success": "false", "error": "' + error + '" }');
                    res.end();
                });
            }).catch(function(error) {
                res.write('{ "success": "false", "error": "' + error + '" }');
                res.end();
            });
        });
        req.on('error', function (e) {
            console.log('error', e.message);
            res.write('{ "success": "false", "error": "' + e.message + '" }');
            res.end();
        });
    } else if (req.originalUrl == '/api/v1/adminusers/create') {
        let body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) req.connection.destroy();
        })
        req.on('end', function () {
            body = JSON.parse(body)
            console.log('body: ', body);
            admin.auth().verifyIdToken(body.token)
            .then(function(decodedToken) {
                let uid = decodedToken.uid;
                admin.auth().getUser(uid)
                .then(function(userRecord) {
                    console.log('Successfully fetched user status:', userRecord.toJSON().customClaims.status);
                    if (userRecord.toJSON().customClaims.status == 'admin') {
                        admin.auth().createUser(body.content)
                        .then(function(userRecord) {
                            console.log('Successfully created user', userRecord.toJSON());
                            admin.auth().setCustomUserClaims(userRecord.toJSON().uid, body.claims)
                            .then(function() {
                                console.log('Successfully set user claims: ', body.claims);
                                res.write('{ "success": "true", "insertedId": "' + userRecord.toJSON().uid + '" }');
                                res.end();
                            })
                            .catch(function(error) {
                                console.log('Error setting user claims:', error);
                                res.write('{ "success": "false", "error": "' + error + '" }');
                                res.end();
                            });
                        })
                        .catch(function(error) {
                            console.log('Error creating user:', error);
                            res.write('{ "success": "false", "error": "' + error + '" }');
                            res.end();
                        });
                    } else {
                        res.write('{ "success": "false", "error": "User doesn\'t meet the required permissions" }');
                        res.end();
                    }
                })
                .catch(function(error) {
                    res.write('{ "success": "false", "error": "' + error + '" }');
                    res.end();
                });
            }).catch(function(error) {
                res.write('{ "success": "false", "error": "' + error + '" }');
                res.end();
            });
        });
        req.on('error', function (e) {
            console.log('error', e.message);
            res.write('{ "success": "false", "error": "' + e.message + '" }');
            res.end();
        });
    } else if (req.originalUrl == '/api/v1/adminusers/delete') {
        let body = '';
        req.on('data', function (data) {
          body += data;
          if (body.length > 1e6) req.connection.destroy();
        })
        req.on('end', function () {
            body = JSON.parse(body)
            console.log('body: ', body);
            admin.auth().verifyIdToken(body.token)
            .then(function(decodedToken) {
                let uid = decodedToken.uid;
                admin.auth().getUser(uid)
                .then(function(userRecord) {
                    if (userRecord.toJSON().customClaims.status == 'admin') {
                        admin.auth().deleteUser(body.uid)
                        .then(function() {
                            console.log('Successfully deleted user ', body);
                            res.write('{ "success": "true", "insertedId": "' + body + '" }');
                            res.end();
                        })
                        .catch(function(error) {
                            console.log('Error deleting user:', error);
                            res.write('{ "success": "false", "error": "' + error + '" }');
                            res.end();
                        });
                    } else {
                        res.write('{ "success": "false", "error": "User doesn\'t meet the required permissions" }');
                        res.end();
                    }
                })
                .catch(function(error) {
                    res.write('{ "success": "false", "error": "' + error + '" }');
                    res.end();
                });
            }).catch(function(error) {
                res.write('{ "success": "false", "error": "' + error + '" }');
                res.end();
            });
        });
        req.on('error', function (e) {
            console.log('error', e.message);
            res.write('{ "success": "false", "error": "' + e.message + '" }');
            res.end();
        });
    }
    console.log('end of API')
}