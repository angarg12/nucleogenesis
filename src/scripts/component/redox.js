'use strict';

angular.module('game').component('redox', {
  templateUrl: 'views/redox.html',
  controller: 'ct_redox',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_redox', ['state', 'data', 'visibility', 'util', 'format', 'reaction',
  function (state, data, visibility, util, format, reaction) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.visibility = visibility;
    ct.util = util;
    ct.format = format;
    ct.reaction = reaction;

    ct.redox = [{
      resource: '1H',
      number: 50,
      active: false,
      from: 0,
      to: 1
    }];
    ct.channels = 2;
    ct.bandwidth = 100;

    function update(player) {
      for (let redox of ct.redox) {
        if (!redox.resource || !redox.active) {
          continue;
        }

        let reactant = ct.generateName(redox.resource, redox.from);
        let number = Math.min(redox.number, player.resources[reactant].number);
        let react = ct.redoxReaction(redox);

        ct.reaction.react(number, react, player);
      }
    }

    ct.redoxReaction = function (redox) {
      let reactant = ct.generateName(redox.resource, redox.from);
      let product = ct.generateName(redox.resource, redox.to);
      // we retrieve the element of the isotope from the resource
      let element = Object.keys(data.resources[redox.resource].elements)[0];
      let energy = redoxEnergy(redox.from, redox.to, element);

      let react = {
        'reactant': {},
        'product': {}
      };

      react.reactant[reactant] = 1;
      react.product[product] = 1;
      if (energy > 0) {
        react.reactant.eV = energy;
      } else if (energy < 0) {
        react.product.eV = -energy;
      }

      let electron = redox.from - redox.to;
      if (electron > 0) {
        react.reactant['e-'] = electron;
      } else if (electron < 0) {
        react.product['e-'] = -electron;
      }

      return react;
    };

    function redoxEnergy(from, to, element) {
      let energyFrom = cumulativeEnergy(element, from);
      let energyTo = cumulativeEnergy(element, to);
      let energy = energyTo - energyFrom;

      return energy;
    }

    function cumulativeEnergy(element, level) {
      let energy = 0;
      let start = Math.min(0, level);
      let end = Math.max(0, level);
      for (let i = start; i <= end; i++) {
        energy += data.redox[element][i];
      }
      if (level < 0) {
        energy = -energy;
      }
      return energy;
    }

    // Generates the name of a ion, e.g. 18O3+
    ct.generateName = function (isotope, i) {
      if (i === 0) {
        return isotope;
      }
      let postfix = '';
      if (Math.abs(i) > 1) {
        postfix = Math.abs(i);
      }
      postfix += getSign(i);
      let name = isotope + postfix;
      // special case!! 1H+ is just a proton
      if (name === '1H+') {
        name = 'p';
      }
      return name;
    };

    function getSign(number) {
      return number > 0 ? '+' : '-';
    }

    state.registerUpdate('redox', update);
  }
]);
