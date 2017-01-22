var module = angular.module('incremental', [ 'ngAnimate' ])
.filter('numberEx', ['numberFilter', '$locale',
  function(number, $locale) {

    var formats = $locale.NUMBER_FORMATS;
    return function(input, fractionSize) {
      
      if(input === null){
    	  return "";
      }
      //Get formatted value
      var formattedValue = number(input, fractionSize);

      //get the decimalSepPosition
      var decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);

      //If no decimal just return
      if (decimalIdx == -1) return formattedValue;


      var whole = formattedValue.substring(0, decimalIdx);
      var decimal = (Number(formattedValue.substring(decimalIdx)) || "").toString();

      return whole +  decimal.substring(1);
    };
  }
]);;