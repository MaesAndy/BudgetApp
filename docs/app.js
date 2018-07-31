//BUDGET CONTROLLER

var budgetController = (function(){

  var Expense = function(id, description, value){
    this.id = id,
    this.description = description,
    this.value = value,
    this.percentage = -1
  };

/*  Expense.prototype.calcPercentage = function(totalIncome){

    if (totalIncome > 0){
    this.percentage = Math.round((this.value / totalIncome)*100);
    } else{
      this.percentage = -1;
    }

  };*/

/*  Expense.prototype.getPercentage = function(){
    return this.percentage;
  }*/

  var Income = function(id, description, value){
    this.id = id,
    this.description = description,
    this.value = value
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum = sum + cur.value;
    });
    data.totals[type] = sum;
  }

  var data = {
      allItems: {
        exp: [],
        inc: [],
      },
      totals: {
        exp: 0,
        inc:0
      },
      budget: 0,
      percentage: -1

    };

    return { //GETS PUBIC
      addItem: function(type, des, val){
          var newItem, ID;
          // create new ID
          if (data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length -1].id + 1;
        }else{
          ID = 0;
        }

          //createte new id based on inc or exp
          if (type ==='exp'){
            newItem = new Expense(ID, des, val);
        } else if (type ==='inc'){
            newItem = new Income(ID, des, val);

        }//push it into our data structure
        data.allItems[type].push(newItem);
        console.log("data: " +data);
        localStorage.setItem('storageLocal', JSON.stringify(data));
        //return the new element
        return newItem; //GETS PUBLIC



      },

      deleteItem: function(type, id){
        var ids, index;
        // id = 6
        //data.allItems[type][id];

        //ids = [1 2 4 6 8]
        // index = 3

        ids = data.allItems[type].map(function(current){

          return current.id;

        });

        index = ids.indexOf(id); //index of 6 is 3

        if (index !== -1){
          data.allItems[type].splice(index, 1);
          localStorage.setItem('storageLocal', JSON.stringify(data));
        }



      },


      calculateBudget: function(){

          //calculate total income and expenses__list
          calculateTotal('exp');
          calculateTotal('inc');


          //calculate the budget: income - expenses

          data.budget = data.totals.inc - data.totals.exp;

          // calculate the percentage of income the we spent
          if(data.totals.inc > 0){

          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else{
          data.percentage = -1; // = NON existant
        }

      },

      calculatePercentage: function(){

        /*
        a=20
        b=10
        c=40
        income = 100
        a= 20/100 = 20%
        b= 10%
        c = 40%

        */

        data.allItems.exp.forEach(function(cur){

          if (data.totals.inc > 0){
          cur.percentage = Math.round((cur.value / data.totals.inc)*100);
          console.log("thispercentage: " + cur.percentage);
          } else{
            cur.percentage = -1;
          }



        });
        localStorage.setItem('storageLocal', JSON.stringify(data));
      },

      getPercentages: function() {
          var allPerc = data.allItems.exp.map(function(cur){
            return cur.percentage;

          });
          return allPerc;
        },





      getBudget: function(){
        return {
          budget: data.budget,
          totalInc:data.totals.inc,
          totalExp:data.totals.exp,
          percentage: data.percentage

        }
      },


      testing: function() {
        console.log(data);
        return data;
      },

      getLocalStorage: function(storage){
        data = storage;

        return data;

      },

      totalbudget: function(){
        var totalExp;
        var i=0;
        for(i=0; i < data.allItems[exp].length; i++){
          totalExp = totalExp + data.allItems[exp][i].value;
        } return totalExp;
      }


    };

})();






















//UI CONTROLLER
var UIController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'

  };

  var formatNumber = function(num, type) {
    /*
    + or - beofre formatNumberexactly
    2 decimal points
    comma seperating the thousands

    2000 -> + 2,000.00
    */
    var numSplit, int, dec, symbol;
    num = Math.abs(num);
    num = num.toFixed(2); // gives back a DOMstrings
    numSplit = num.split('.'); // gives an Array
    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    if (type === 'inc'){
      symbol = '+';

    }
    else{ symbol = '-'}
    return symbol + ' ' + int + '.' + dec;

  };

  var nodeListForEach = function(list, callback){
    for (var i = 0; i < list.length; i++){
      callback(list[i], i);
    }
  };






  return  { //GETS PUBLIC
    getinput: function(){
      return{
          type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
    };

  },

  addListItem: function(obj, type){
    var html, newHtml, element;
    // create HTML string with placeholder text

    if(type === "inc"){
      element = DOMstrings.incomeContainer;
      html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
   else if(type ==="exp"){
      element = DOMstrings.expensesContainer;
      html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }

   // Replace the placeholder text with some actual data

   newHtml = html.replace('%id%', obj.id);
   newHtml = newHtml.replace('%description%', obj.description);
   newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


    //insert the HTML into the DOM

    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

  },

  deleteListItem: function(selectorID){
    var el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);


  },

    clearFields: function(){
      var fields, fieldsArr;
     fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);//gives a list, no array
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array){
        current.value = "";
      });
      fieldsArr[0].focus();

      //THE EASY WAY :)

    /* var description, value;
      description = document.querySelector(DOMstrings.inputDescription);
      value = document.querySelector(DOMstrings.inputValue);
      description.value = "";
      value.value = "";*/

    },


    displayBudget: function(obj){
      obj.budget > 0 ? type= 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');


      if(obj.percentage > 0 ){
          document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      }
      else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';

      }


    },

    displayPercentages: function(percentages){

      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);






      nodeListForEach(fields, function(current, index)  {

        if(percentages[index] > 0){
        current.textContent = percentages[index] + '%';
      } else{
        current.textContent = '---';
      }

      });


    },


 displayMonth: function(){
   var year, now, month;
   now = new Date();
   //var christmas = Data(2016, 11, 25);

   months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

   year = now.getFullYear();
   month= now.getMonth();
   month = months[month];
   document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;
 },

 changedType: function(){
  var fields = document.querySelectorAll(
  DOMstrings.inputType + ',' +
  DOMstrings.inputDescription + ',' +
  DOMstrings.inputValue);


nodeListForEach(fields, function(cur){
  cur.classList.toggle('red-focus');

});

document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
document.querySelector('.add').classList.toggle('red');


},

readLocalStorage: function(incomes, expenses){


  if(incomes){
    console.log("loadedData: "+incomes[0].id + incomes[0].description + incomes[0].value);


    var html, newHtml, el;
    for (var i = 0; i < incomes.length; i++){
      el = DOMstrings.incomeContainer;
      html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      newHtml = html.replace("%id%", incomes[i].id);
      newHtml = newHtml.replace("%description%", incomes[i].description);
      newHtml = newHtml.replace("%value%", formatNumber(incomes[i].value, 'inc'));

      document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
    }

  }
  if(expenses){
    var html, newHtml, el;
    for (var i = 0; i < expenses.length; i++){
      el = DOMstrings.expensesContainer;
      html ='<div class="item clearfix" id="exp-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage% %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      newHtml = html.replace("%id%", expenses[i].id);
      newHtml = newHtml.replace("%description%", expenses[i].description);
      newHtml = newHtml.replace("%value%", formatNumber(expenses[i].value, 'exp'));
      newHtml = newHtml.replace("%percentage%", expenses[i].percentage);

      document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
    }
  }

},








  getDOMstrings: function(){
      return DOMstrings; //GETS PUBLIC

    }
  };

})();















//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

  var setupEventListeners = function(){
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.wich === 13){
          ctrlAddItem();
        }

    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

  };









var updateBudget = function(){

  //1. Calculate the budget
budgetCtrl.calculateBudget();


  //2. Return the budget
  var budget = budgetCtrl.getBudget();
  console.log(budget);

  //3. Display the budget on the UI

  UICtrl.displayBudget(budget);






};


var updatePercentages = function(){

  // 1. calculate updatePercentages
  budgetCtrl.calculatePercentage();

  // 2. read percentage from the budget CONTROLLER
var percentages = budgetCtrl.getPercentages();
  //3. update user interface
  UICtrl.displayPercentages(percentages);

};








  var ctrlAddItem = function(){
    var input, newItem;
    // 1. get the field input data
      input = UICtrl.getinput();

      if(input.description !=="" && !isNaN(input.value) && input.value > 0){
    //2. Add the item to the budget CONTROLLER
      newItem =   budgetCtrl.addItem(input.type, input.description, input.value);
    //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
    //4.Clear the fields
      UICtrl.clearFields();



    //5. Calculate and update budget
   updateBudget();

 }

    //6. calculate updatePercentages

    updatePercentages();


  };



  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){

      //inc-1
      splitID = itemID.split('-'); // array ["inc", "1"]
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from datastructure
      budgetCtrl.deleteItem(type, ID);

      // 2. delete item from UI

      UICtrl.deleteListItem(itemID);



      // 3. update and show the new budget
      updateBudget();

      // 4. update percentages
      updatePercentages();

    }



  };

return{
  init: function(){
    const storage = JSON.parse(localStorage.getItem('storageLocal'));

    if(storage){

      var loadedData = budgetCtrl.getLocalStorage(storage);
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: loadedData.budget,
        totalInc:loadedData.totals.inc,
        totalExp:loadedData.totals.exp,
        percentage: loadedData.percentage
      });

      UICtrl.readLocalStorage(loadedData.allItems.inc, loadedData.allItems.exp);
      setupEventListeners();
    }
  else{


      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc:0,
        totalExp:0,
        percentage: -1
      });
      setupEventListeners();
    }
  }
}


})(budgetController, UIController);

controller.init();
