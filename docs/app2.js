var budgetController = (function() {

  var Income = function(ID, description, value){
    this.ID = ID;
    this.description = description;
    this.value = value;



  };

  var Expense = function(ID, description, value){
    this.ID = ID;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };





  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round(this.value / totalIncome *100);

    }
    else{this.percentage = -1;}
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };

  var data = {
    allItems : {
      inc:[],
      exp:[]
    },
    totals : {
      exp: 0,
      inc: 0
    },
    budget:0,
    percentage:0
  };


  return{
      addItem: function(type, description, value){

        console.log("description: " +description);
        console.log("value: " +value);
        console.log("type: " +type);

        var id, newItem;

        if (data.allItems[type].length > 0){
          id = data.allItems[type][data.allItems[type].length - 1].ID + 1;
        }
        else {id = 0;}

        if(type === 'inc'){
          newItem = new Income(id, description, value);
          data.allItems.inc.push(newItem);
          localStorage.setItem('incomes', JSON.stringify(data.allItems.inc));

        }
        else if (type ==='exp'){
          newItem = new Expense(id, description, value);
          data.allItems.exp.push(newItem);
          localStorage.setItem('expenses', JSON.stringify(data.allItems.exp));


        }






        return newItem;



      },

      calculateBudget: function(){
        var totalInc, totalExp, totalBudget, percentage;
        totalInc = 0;
        totalExp = 0;
        totalBudget = 0;
        percentage = 0;

        data.allItems.inc.forEach(function(cur){
          totalInc = totalInc + cur.value;

        });

        data.allItems.exp.forEach(function(cur){
          totalExp = totalExp + cur.value
        });

        totalBudget = totalInc - totalExp;
        console.log("the total expense is:" +totalExp);
        console.log("The total budget is: " + totalBudget);

        data.totals.inc = totalInc;
        data.totals.exp = totalExp;
        data.budget = totalBudget;

        if (totalInc > 0){
        percentage = Math.round(totalExp / totalInc *100);
      }
      else {percentage = -1;}
        data.percentage = percentage;
        localStorage.setItem('totalIncome', JSON.stringify(data.totals.inc));
        localStorage.setItem('totalExpense', JSON.stringify(data.totals.exp));
        localStorage.setItem('totalBudet', JSON.stringify(data.budget));
        localStorage.setItem('totalPercentage', JSON.stringify(data.percentage));







      },

      getBudget: function(){
        return{
          totalIncome: data.totals.inc,
          totalExpense: data.totals.exp,
          budget: data.budget,
          percentage: data.percentage

        };

      },


      deleteItem: function(id, type){



        var idArray, index;

        idArray = data.allItems[type].map(function(current){
          return current.ID;
        });
        console.log(idArray);

        index = idArray.indexOf(parseInt(id));

        console.log("the place in the array is " +index);

        if (index !== -1){
          data.allItems[type].splice(index, 1);
        }
        if(type === 'inc'){
          localStorage.setItem('incomes', JSON.stringify(data.allItems.inc));
        }
        if(type === 'exp'){
          localStorage.setItem('expenses', JSON.stringify(data.allItems.exp));
        }


        return index;



      },

      calculatePercentages: function(){

        data.allItems.exp.forEach(function(cur){
          this.percentage = cur.calcPercentage(data.totals.inc)

        });

      },

      getPercentages: function(){
        var percentagesArray;

        percentagesArray = data.allItems.exp.map(function(cur){
          return cur.getPercentage();
        });
        return percentagesArray;

      },



      testing: function(){
        console.log(data);
      },


      readStorage: function(){
        const storageIncomes = JSON.parse(localStorage.getItem('incomes'));
        const storageExpenses = JSON.parse(localStorage.getItem('expenses'));
        const storageTotalBudget = JSON.parse(localStorage.getItem('totalBudet'));
        const storageTotalExpense = JSON.parse(localStorage.getItem('totalExpense'));
        const storageTotalIncome = JSON.parse(localStorage.getItem('totalIncome'));
        const storageTotalPercentage = JSON.parse(localStorage.getItem('totalPercentage'));
        if(storageIncomes) {
          data.allItems.inc = storageIncomes;
        }
        if(storageExpenses) {
          data.allItems.exp = storageExpenses;
        }
        if(storageTotalBudget) {
          data.budget = storageTotalBudget;
        }
        if(storageTotalExpense) {
          data.totals.exp = storageTotalExpense;
        }
        if(storageTotalIncome) {
          data.totals.inc = storageTotalIncome;
        }
        if(storageTotalPercentage) {
          data.percentage = storageTotalPercentage;
        }
        return{
          totalIncome: data.totals.inc,
          totalExpense: data.totals.exp,
          budget: data.budget,
          percentage: data.percentage,
          incomes: data.allItems.inc,
          expenses: data.allItems.exp

        };

      }




  }

})();









var UIController = (function() {

  var DOMstrings = {
    inputBtn: '.add__btn',
    type: '.add__type',
    description:'.add__description',
    value: '.add__value',
    incomeList: '.income__list',
    expensesList: '.expenses__list',
    budget: '.budget__value',
    totalInc: '.budget__income--value',
    totalExp: '.budget__expenses--value',
    percentage: '.budget__expenses--percentage',
    month: '.budget__title--month',
    container: '.container',
    percentagesLabel: '.item__percentage'

  };

  var formatNumber = function(number, type){
    var n, nArray, int, dec, sign;
    n = Math.abs(number);
    n = n.toFixed(2);
    nArray = n.split('.');
    int = nArray[0];
    dec = nArray[1];
    if (int.length > 3){
      int = int.substr(0, int.length-3) + ',' + int.substr(int.length - 3, int.length);
    }
    if (type === 'exp'){
      sign = '-';
    }
    else if (type === 'inc'){
      sign = '+';
    }

    return sign + int + '.' + dec;


  };





  return{
        getDOMstrings: function(){
          return DOMstrings;
        },

        getInput: function(){
          return{
            description: document.querySelector(DOMstrings.description).value,
            value: document.querySelector(DOMstrings.value).value,
            type: document.querySelector(DOMstrings.type).value
          }
        },

        readLocalStorage: function(incomes, expenses){
        

          if(incomes){
            var html, newHtml, el;
            for (var i = 0; i < incomes.length; i++){
              el = DOMstrings.incomeList;
              html = '<div class="item clearfix" id="income-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
              newHtml = html.replace("%ID%", incomes[i].ID);
              newHtml = newHtml.replace("%description%", incomes[i].description);
              newHtml = newHtml.replace("%value%", formatNumber(incomes[i].value, 'inc'));

              document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
            }

          }
          if(expenses){
            var html, newHtml, el;
            for (var i = 0; i < expenses.length; i++){
              el = DOMstrings.expensesList;
              html ='<div class="item clearfix" id="expense-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
              newHtml = html.replace("%ID%", expenses[i].ID);
              newHtml = newHtml.replace("%description%", expenses[i].description);
              newHtml = newHtml.replace("%value%", formatNumber(expenses[i].value, 'exp'));

              document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);
            }
          }

        },

        addListItem: function(obj, type){
        var html, newHtml, el;
        if(type === "inc"){
          el = DOMstrings.incomeList;
          html = '<div class="item clearfix" id="income-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          newHtml = html.replace("%ID%", obj.ID);
          newHtml = newHtml.replace("%description%", obj.description);
          newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
        }
        else if (type ==="exp"){
          el = DOMstrings.expensesList;
          html ='<div class="item clearfix" id="expense-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          newHtml = html.replace("%ID%", obj.ID);
          newHtml = newHtml.replace("%description%", obj.description);
          newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

        }

        document.querySelector(el).insertAdjacentHTML('beforeend', newHtml);



      },

        clearInputFields: function(){
          var fields, fieldsArr;

          fields = document.querySelectorAll(DOMstrings.description + ", " + DOMstrings.value);


          fieldsArr = Array.prototype.slice.call(fields);

          fieldsArr.forEach(function(current){
            current.value = "";
          });
          fieldsArr[0].focus();

        },

        displayBudget: function(budget){
          if(budget.budget > 0){
            document.querySelector(DOMstrings.budget).innerHTML = formatNumber(budget.budget, 'inc');
          }
          else{document.querySelector(DOMstrings.budget).innerHTML = formatNumber(budget.budget, 'exp');}

          document.querySelector(DOMstrings.totalInc).innerHTML = formatNumber(budget.totalIncome, 'inc');
          document.querySelector(DOMstrings.totalExp).innerHTML = formatNumber(budget.totalExpense, 'exp');
          document.querySelector(DOMstrings.percentage).innerHTML = budget.percentage +'%';



        },

        deleteListItem: function(selectorID){
          var el;


          el = document.getElementById(selectorID);
          el.parentNode.removeChild(el);




        },

        displayMonth: function(){
          var date = new Date();
          var month = date.getMonth();
          var year = date.getFullYear();
          var monthString;

          var monthArray = ['January', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

          monthString = monthArray[month];
          console.log(monthString);

          document.querySelector(DOMstrings.month).innerHTML = monthString + ' ' + year;



        },

        displayPercentages: function(percentages){
          console.log(percentages);

          var fields = document.querySelectorAll(DOMstrings.percentagesLabel);
          console.log(fields);

          var nodeListForEach = function(list, callback){
            for (var i = 0; i < list.length; i++){
              callback (list[i], i);
              console.log(list[i]);
            }

          }

          nodeListForEach(fields, function(current, index){
            if (percentages[index] > 0){
            current.textContent = percentages[index] + "%";}
            else{
              current.textContent = '---';
            }

          });

        }

  }

})();








var Controller = (function (budgetCtrl, UIctrl) {



  var DOM = UIctrl.getDOMstrings();
  var setupEventListeners = function(){

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener("keypress", function(event){

      if(event.keyCode === 13){
        ctrlAddItem();
      }

    } );
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  };

  var ctrlAddItem = function(){

//get values from eventlistener
  var newItem, input;

  input = UIctrl.getInput();


//adding values to the budgetController

if(input.description !== "" && !isNaN(input.value) && input.value > 0){

    newItem = budgetCtrl.addItem(input.type, input.description, parseFloat(input.value));
    UIctrl.addListItem(newItem, input.type);
    UIctrl.clearInputFields();
    updateBudget();
    updatePercentages();



  }

};

var ctrlDeleteItem = function(event){
  var idName, array, type;
  idName = event.target.parentNode.parentNode.parentNode.parentNode.id;
  array = idName.split("-");
  type = array[0].substr(0,3);


  // delete from datastructure

  budgetCtrl.deleteItem(array[1], type);
  UIctrl.deleteListItem(idName);
  updateBudget();



  // delete from UI



}

var updateBudget = function(){
  var budget;
  budgetCtrl.calculateBudget();
  budget = budgetCtrl.getBudget();
  UIctrl.displayBudget(budget);

}

var updatePercentages = function(){
  budgetCtrl.calculatePercentages();

  var arrayPercentages = budgetCtrl.getPercentages();
  UIctrl.displayPercentages(arrayPercentages);


}

  return{
    init: function(){

      startscreen = budgetCtrl.readStorage();
      UIctrl.displayMonth();
      UIctrl.displayBudget({budget: startscreen.budget,
        totalIncome: startscreen.totalIncome,
        totalExpense: startscreen.totalExpense,
        percentage:startscreen.percentage}) ;
      UIctrl.readLocalStorage(startscreen.incomes, startscreen.expenses);

      setupEventListeners();
    }
  }





})(budgetController, UIController);

Controller.init();
