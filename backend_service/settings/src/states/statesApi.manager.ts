import config from '../config/config'
export const listStates = (_body)=> {
    return new Promise((resolve, reject) => {
            const states=config.states
            const result = states.filter(state=>state.country_id ==_body.countryId);
            resolve({ code: 200, message: "States listed Succesfully", data: { states: result } });
    });
}
