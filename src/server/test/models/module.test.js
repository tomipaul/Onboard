import should from 'should';
import models from '../../models';
import '../../app';

describe('Module Model:', () => {
  it('should be able to save a new module', (done) => {
    models.Module.create(
    {
      name: 'test module',
      totalDuration: 5
    })
      .then((new_module) => {
        should.exist(new_module);
        should.exist(new_module.name);
        should.exist(new_module.totalDuration);
        new_module.name.should.equal('test module');
        new_module.totalDuration.should.equal(5);
      });
    done();
  });
});
