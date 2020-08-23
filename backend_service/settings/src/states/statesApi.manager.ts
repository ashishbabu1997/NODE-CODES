import config from '../config/config'
export const listStates = ()=> {
    return new Promise((resolve, reject) => {
            // const states=config.states
            // const result = states.filter(state => state.countryId =_body.countryId);
            resolve({ code: 200, message: "Countries listed Succesfully", data: { states: config.states } });
    });
}
