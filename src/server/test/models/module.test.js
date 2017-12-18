import should from 'should';
import models from '../../models';

describe('Module Model:', () => {
  it('should be able to save a new module', (done) => {
    models.Module.create({
      name: 'test module',
      totalDuration: 5
    })
      .then((newModule) => {
        should.exist(newModule);
        should.exist(newModule.name);
        should.exist(newModule.totalDuration);
        newModule.name.should.equal('test module');
        newModule.totalDuration.should.equal(5);
      });
    done();
  });
});
