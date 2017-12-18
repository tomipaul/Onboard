import should from 'should';
import models from '../../models';

describe('Session Model:', () => {
  it('should be able to save a new session', (done) => {
    models.Session.create({
      name: 'test session',
      challengeId: 1,
      moduleId: 1,
      userId: 1
    })
      .then((session) => {
        should.exist(session);
        should.exist(session.name);
        should.exist(session.challengeId);
        should.exist(session.moduleId);
        should.exist(session.id);
        session.name.should.equal('test session');
        session.challengeId.should.equal(1);
        session.moduleId.should.equal(1);
        session.userId.should.equal(1);
      });
    done();
  });
});
