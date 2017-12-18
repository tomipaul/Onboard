import should from 'should';
import models from '../../models';

describe('User Model:', () => {
  it('should be able to add a new user to the database', (done) => {
    models.User.create({
      username: 'user',
      password: 'pass',
      email: 'user@email.com'
    })
      .then((user) => {
        should.exist(user);
        should.exist(user.username);
        should.exist(user.password);
        user.username.should.equal('user');
        user.email.should.equal('user@email.com');
      });
    done();
  });
});
