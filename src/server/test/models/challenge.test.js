import should from 'should';
import models from '../../models';

describe('Challenge Model:', () => {
  it('should be able to save a new challenge', (done) => {
    models.Challenge.create({
      name: 'test challenge',
      duration: 5,
      moduleId: 12
    })
      .then((challenge) => {
        should.exist(challenge);
        should.exist(challenge.name);
        should.exist(challenge.duration);
        challenge.name.should.equal('test challenge');
        challenge.duration.should.equal(5);
      });
    done();
  });
});
