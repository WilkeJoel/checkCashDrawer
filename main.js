function precisionRoundMod(number) {
    if (parseInt(number) != number) {
      var factor = Math.pow(10, 2);
      var n = 2 < 0 ? number : 0.01 / factor + number;
      return Math.round(n * factor) / factor;
    }
    return number;
  }
  
  function checkCashDrawer(price, cash, cid) {
    let returnObj = {
      change: []
    };
    const myObj = {
      "PENNY": .01, "NICKEL": .05, "DIME": .1, "QUARTER": .25, "ONE": 1,
      "FIVE": 5, "TEN": 10, "TWENTY": 20, "ONE HUNDRED": 100
    }
    const reducer = (prev, cur) => {
      return precisionRoundMod(prev + cur[1]);
    }
  
    const changeAvail = cid.reduce(reducer, 0);
    const changeNeeded = cash - price;
    const changeRemain = changeAvail - changeNeeded;
  
    if (changeRemain === 0) {
      returnObj.status = "CLOSED";
      returnObj.change = [...cid];
    }
    else if (changeRemain < 0) {
      returnObj.status = "INSUFFICIENT_FUNDS";
      returnObj.change = [];
    }
    else {
      cid.reverse().reduce((prev, cur) => {
        let changeGiven = [cur[0], 0];
        let denomVal = myObj[cur[0]];
  
        if (denomVal <= prev && cur[1] > 0 && prev > 0) {
          while (cur[1] > 0 && denomVal <= prev) {
            cur[1] = precisionRoundMod(cur[1] - denomVal);
            prev = precisionRoundMod(prev - denomVal);
            changeGiven[1] = precisionRoundMod(changeGiven[1] + denomVal);
          }
          returnObj.change.push(changeGiven);
        }
        return prev;
      }, changeNeeded);
  
      //  verify that currect change was made
      let checkVal = returnObj.change.reduce(reducer, 0);
  
      if (checkVal === changeNeeded) {
        returnObj.status = "OPEN";
      }
      else {
        returnObj.status = "INSUFFICIENT_FUNDS";
        returnObj.change = [];
      }
    }
    return returnObj;
  }
  
  
  /*
  checkCashDrawer(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]) should return {status: "OPEN", change: [["QUARTER", 0.5]]}.
  checkCashDrawer(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]) should return {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}.
  checkCashDrawer(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]) should return {status: "INSUFFICIENT_FUNDS", change: []}.
  checkCashDrawer(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]) should return {status: "INSUFFICIENT_FUNDS", change: []}.
  checkCashDrawer(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]) should return {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}.
  */