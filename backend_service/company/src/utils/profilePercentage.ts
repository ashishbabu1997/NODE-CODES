import { getProfilePercentage } from "../queryService/queryService";

export const hirer = (_body) => {
     let count = 0;
     if (_body.logo == '' && _body.coverPage == '' && _body.linkedinId == '' && _body.tagline == '') {
          count = 50;

     }
     else if (_body.logo == '' || _body.coverPage == '' || _body.linkedinId == '' || _body.tagline == '') {
          count = 90
          if ((_body.logo == '' && _body.coverPage == '') || (_body.logo == '' && _body.linkedinId == '') || (_body.logo == '' && _body.tagline == '') || (_body.coverPage == '' && _body.linkedinId == '') || (_body.coverPage == '' && _body.tagline == '') || (_body.linkedinId == '' && _body.tagline == '')) {
               count = 75;
               if ((_body.logo == '' && _body.coverPage == '' && _body.linkedinId == '') || (_body.logo == '' && _body.linkedinId == '' && _body.tagline == '') || (_body.tagline == '' && _body.coverPage == '' && _body.linkedinId == '') || (_body.tagline == '' && _body.coverPage == '' && _body.logo == '')) {
                    count = 65;
               }
          }
     }
     else {
          count = 100
     }
     return count;
}


export const update = (_body, profilePercentage) => {
     let count = 0;
     if (profilePercentage <= 50) {
          if (_body.logo == '' && _body.coverPage == '' && _body.linkedinId == '' && _body.tagline == '') {
               count = profilePercentage + 25;

          }
          else if (_body.logo == '' || _body.coverPage == '' || _body.linkedinId == '' || _body.tagline == '') {
               count = profilePercentage + 40
               if ((_body.logo == '' && _body.coverPage == '') || (_body.logo == '' && _body.linkedinId == '') || (_body.logo == '' && _body.tagline == '') || (_body.coverPage == '' && _body.linkedinId == '') || (_body.coverPage == '' && _body.tagline == '') || (_body.linkedinId == '' && _body.tagline == '')) {
                    count = profilePercentage + 35;
                    if ((_body.logo == '' && _body.coverPage == '' && _body.linkedinId == '') || (_body.logo == '' && _body.linkedinId == '' && _body.tagline == '') || (_body.tagline == '' && _body.coverPage == '' && _body.linkedinId == '') || (_body.tagline == '' && _body.coverPage == '' && _body.logo == '')) {
                         count = profilePercentage + 30;
                    }
               }
          }
          else {
               count = profilePercentage + 50
          }
     }

     return count;
}
