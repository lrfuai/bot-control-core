const request = require('request-promise');
const {Events,emit} = require('../../../events');
const http_responder = require('../../http-responder');

const PATH = `/v1/components/actuators/lights/:id`;

const ACTIONS = {
  ON: 'ON',
  OFF: 'OFF'
};

module.exports = (id)=> {
  return {
    sender: (Endpoint) => {
      const uri = Endpoint + PATH.replace(':id', id);
      return {
        on: () => {
          const setup = {method: 'PUT',uri, qs: {action:ACTIONS.ON},simple: true,json: true};
          emit(Events.COMPONENT_REQUESTED,setup);
          return request(setup);
        },
        off: () => {
          const setup = {method: 'PUT',uri,qs: {action:ACTIONS.OFF},simple: true,json: true};
          emit(Events.COMPONENT_REQUESTED,setup);
          return request(setup)
        }
      }
    },
    receiver: (server) => server.put(PATH.replace(':id', id),(req,res) => {
      const {action} = req.query;
      const responder = http_responder(res);
      try {
        switch (action) {
          case ACTIONS.ON:
          case ACTIONS.OFF:
            emit(Events.COMPONENT_REACHED,{id,action,responder});
            break;
          default: responder.error(res,`Unknown action '${action}'`);
        }
      } catch (ex) {
        responder.error(res,ex);
      }
    }),
    state: (state) => emit(Events.COMPONENT_CHANGED,{id,state})
  }
};