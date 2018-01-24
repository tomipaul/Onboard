import models from '../models';

export const saveSession = () =>
  (req, res) => {
    const { name, moduleId, challengeId } = req.body;
    const payload = {
      name,
      moduleId,
      challengeId,
      userId: req.userId
    };
    return models.Session.create(payload)
      .then((session) => {
        res.status(200).json({
          message: 'Session saved successfully',
          session
        });
      });
  };

export default saveSession;
